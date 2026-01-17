
import React, { useState, useMemo } from 'react';
import { Transaction, Expense, StoreSettings, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, TrendingUp, ArrowDownRight, Calendar, ArrowUpRight } from 'lucide-react';

// Props interface
interface ReportsViewProps {
  transactions: Transaction[];
  expenses: Expense[];
  settings: StoreSettings;
  currentUser: User;
}

// Date range options
type DateRangeOption = '7d' | '30d' | '90d' | 'all';

// Main component
export const ReportsView: React.FC<ReportsViewProps> = ({ transactions, expenses, settings, currentUser }) => {
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
  
  // Memoized filtered data based on date range
  const { filteredTransactions, filteredExpenses, filteredSales, filteredReturns } = useMemo(() => {
    const now = new Date();
    const getStartDate = (range: DateRangeOption) => {
      const startDate = new Date();
      if (range === '7d') startDate.setDate(now.getDate() - 7);
      else if (range === '30d') startDate.setDate(now.getDate() - 30);
      else if (range === '90d') startDate.setDate(now.getDate() - 90);
      else return new Date(0); // 'all' time
      return startDate;
    };

    const startDate = getStartDate(dateRange);
    
    const fTrans = transactions.filter(t => new Date(t.date) >= startDate);
    const fExp = expenses.filter(e => new Date(e.date) >= startDate);
    const fSales = fTrans.filter(t => t.type === 'sale');
    const fReturns = fTrans.filter(t => t.type === 'return');

    return { filteredTransactions: fTrans, filteredExpenses: fExp, filteredSales: fSales, filteredReturns: fReturns };
  }, [transactions, expenses, dateRange]);

  // Calculate KPIs
  const totalRevenue = filteredSales.reduce((sum, t) => sum + t.total, 0);
  const totalRefunds = filteredReturns.reduce((sum, t) => sum + t.total, 0);
  const netRevenue = totalRevenue - totalRefunds;

  const totalCOGS = filteredSales.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + (item.cost || 0) * item.quantity, 0), 0);
  const returnedCOGS = filteredReturns.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + (item.cost || 0) * item.quantity, 0), 0);
  const netCOGS = totalCOGS - returnedCOGS;
  
  const grossProfit = netRevenue - netCOGS;
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  // Prepare chart data
  // Top selling products
  const topProducts = useMemo(() => {
    const productSales = new Map<string, { name: string; revenue: number; quantity: number }>();
    filteredSales.forEach(t => {
      t.items.forEach(item => {
        const existing = productSales.get(item.id);
        const revenue = item.price * item.quantity;
        if (existing) {
          existing.revenue += revenue;
          existing.quantity += item.quantity;
        } else {
          productSales.set(item.id, { name: item.name, revenue, quantity: item.quantity });
        }
      });
    });
    return Array.from(productSales.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [filteredSales]);

  // Sales by category
  const salesByCategory = useMemo(() => {
    const categorySales: { [key: string]: number } = {};
    filteredSales.forEach(t => {
        t.items.forEach(item => {
            categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity);
        });
    });
    return Object.entries(categorySales).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredSales]);
  
  const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];
  
  // Sales over time
  const salesOverTime = useMemo(() => {
    const salesByDate: { [date: string]: { sales: number, returns: number } } = {};
    
    const allFiltered = [...filteredSales, ...filteredReturns];
    
    allFiltered.forEach(t => {
        const date = new Date(t.date).toISOString().split('T')[0];
        if (!salesByDate[date]) salesByDate[date] = { sales: 0, returns: 0 };

        if (t.type === 'sale') {
          salesByDate[date].sales += t.total;
        } else {
          salesByDate[date].returns += t.total;
        }
    });
    return Object.entries(salesByDate)
        .map(([date, {sales, returns}]) => ({ date: date.slice(5), amount: sales - returns }))
        .sort((a,b) => a.date.localeCompare(b.date));
  }, [filteredSales, filteredReturns]);
  
  // UI Constants
  const isDarkMode = settings.theme === 'dark';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const axisTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#1e293b';

  const formatCurrency = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const renderDual = (val: number) => {
      const primary = `${settings.currency}${formatCurrency(val)}`;
      if (settings.secondaryCurrency && settings.exchangeRate) {
          const secondary = `${settings.secondaryCurrency}${formatCurrency(val * settings.exchangeRate)}`;
          return `${primary} / ${secondary}`;
      }
      return primary;
  };

  if (currentUser.role === 'Staff') {
    return <div className="text-center p-10">Access to reports is restricted.</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Sales Reports</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Analyze your performance</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="relative">
          <select 
            value={dateRange} 
            onChange={e => setDateRange(e.target.value as DateRangeOption)}
            className="appearance-none w-full sm:w-auto pl-10 pr-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-white/10 focus:border-primary/50 outline-none transition-all backdrop-blur-md shadow-sm text-slate-800 dark:text-white font-bold"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Net Revenue" value={renderDual(netRevenue)} icon={DollarSign} color="green"/>
        <KPICard title="Gross Profit" value={renderDual(grossProfit)} icon={TrendingUp} color="blue"/>
        <KPICard title="Total Expenses" value={renderDual(totalExpenses)} icon={ArrowDownRight} color="amber"/>
        <KPICard title="Net Profit" value={renderDual(netProfit)} icon={netProfit >= 0 ? ArrowUpRight : ArrowDownRight} color={netProfit >= 0 ? "emerald" : "red"}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Over Time Chart */}
        <div className="lg:col-span-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg h-96">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6">Net Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={salesOverTime} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
              <XAxis dataKey="date" tick={{fill: axisTextColor, fontSize: 12}} dy={10} />
              <YAxis tick={{fill: axisTextColor, fontSize: 12}} tickFormatter={(val: number) => `$${val}`} dx={-5} />
              <Tooltip cursor={{fill: 'rgba(128,128,128,0.1)'}} contentStyle={{ backgroundColor: tooltipBg, borderRadius: '12px', border: 'none', color: tooltipText }} formatter={(value: number) => `$${formatCurrency(value)}`}/>
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top Selling Products */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg h-96 flex flex-col">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 shrink-0">Top Products by Revenue</h3>
            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                {topProducts.map((p, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/40 dark:bg-white/5 p-3 rounded-xl border border-white/20">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{p.name}</span>
                        <span className="text-sm font-bold text-primary">{settings.currency}{formatCurrency(p.revenue)}</span>
                    </div>
                ))}
                {topProducts.length === 0 && <p className="text-sm text-slate-400 text-center pt-10">No sales in this period.</p>}
            </div>
        </div>
      </div>
      
      {/* Sales By Category */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg h-96">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Revenue by Category</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {salesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: '12px', border: 'none', color: tooltipText }} formatter={(value: number) => `$${formatCurrency(value)}`} />
            <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: React.ElementType, color: string }) => {
  const colorClasses: {[key: string]: string} = {
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  }
  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg">
      <div className={`p-3 rounded-2xl w-fit mb-3 ${colorClasses[color]}`}><Icon size={22}/></div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight whitespace-pre-wrap">{value}</h4>
    </div>
  )
};
