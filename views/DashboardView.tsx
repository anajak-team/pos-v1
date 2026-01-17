
import React, { useEffect, useState } from 'react';
import { Transaction, User, Expense, StoreSettings, Product } from '../types';
import { generateSalesInsight, generateProfitForecast } from '../services/geminiService';
import { getSettings } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { Sparkles, TrendingUp, DollarSign, ShoppingBag, ShieldAlert, PieChart as PieChartIcon, ArrowDownRight, ArrowUpRight, Wand2, Loader2, Package } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  isDarkMode: boolean;
  currentUser: User;
  expenses: Expense[];
  products: Product[];
}

export const DashboardView: React.FC<DashboardProps> = ({ transactions, isDarkMode, currentUser, expenses, products }) => {
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  
  // Forecast State
  const [profitForecast, setProfitForecast] = useState<string | null>(null);
  const [isForecasting, setIsForecasting] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  // Separate sales and returns
  const sales = transactions.filter(t => t.type === 'sale');
  const returns = transactions.filter(t => t.type === 'return');

  // Compute stats based on sales
  const totalRevenue = sales.reduce((sum, t) => sum + t.total, 0);
  const totalRefunds = returns.reduce((sum, t) => sum + t.total, 0);
  const netRevenue = totalRevenue - totalRefunds;
  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? netRevenue / totalOrders : 0;

  // Financials (Admin/Manager only)
  const calculateCOGS = (trans: Transaction[]) => {
    return trans.reduce((totalCOGS, t) => {
      return totalCOGS + t.items.reduce((itemCOGS, item) => itemCOGS + (item.quantity * (item.cost || 0)), 0);
    }, 0);
  };

  const totalCOGS = calculateCOGS(sales);
  const returnedCOGS = calculateCOGS(returns);
  const netCOGS = totalCOGS - returnedCOGS;

  const grossProfit = netRevenue - netCOGS;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  // Calculate Potential Profit from Inventory
  const potentialProfit = products.reduce((sum, p) => {
      const margin = p.price - (p.cost || 0);
      return sum + (margin * p.stock);
  }, 0);

  // Expense Breakdown Data
  const expenseByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseChartData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));

  const EXPENSE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

  // Prepare chart data (Last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const daySales = sales
      .filter(t => t.date.startsWith(date))
      .reduce((sum, t) => sum + t.total, 0);
    const dayReturns = returns
      .filter(t => t.date.startsWith(date))
      .reduce((sum, t) => sum + t.total, 0);
    return { date: date.slice(5), amount: daySales - dayReturns };
  });

  useEffect(() => {
    if (currentUser.role !== 'Staff') {
      const fetchInsight = async () => {
        if (transactions.length > 0) {
          setLoadingInsight(true);
          const result = await generateSalesInsight(transactions.filter(t => t.type === 'sale'));
          setInsight(result);
          setLoadingInsight(false);
        } else {
          setInsight("No sales data available yet. Start selling to see insights!");
        }
      };
      fetchInsight();
    }
  }, [transactions, currentUser.role]);

  const handleForecastProfit = async () => {
      if (isForecasting) return;
      setIsForecasting(true);
      const forecast = await generateProfitForecast(transactions, expenses, settings?.currency || '$');
      setProfitForecast(forecast);
      setIsForecasting(false);
  };

  // Theme Constants
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const axisTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#1e293b';

  const formatCurrency = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const renderDualCurrency = (amount: number) => {
    if (!settings) return `${formatCurrency(amount)}`;
    const primary = `${settings.currency}${formatCurrency(amount)}`;
    if (settings.secondaryCurrency && settings.exchangeRate) {
        const secondary = `${settings.secondaryCurrency}${formatCurrency(amount * settings.exchangeRate)}`;
        return (
            <div>
                {primary}
                <div className="text-xs sm:text-sm font-medium opacity-60 mt-0.5">≈ {secondary}</div>
            </div>
        );
    }
    return primary;
  };

  if (currentUser.role === 'Staff') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
         <div className="flex justify-between items-end">
          <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Welcome, {currentUser.name}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Here is your daily summary</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gradient-to-br from-blue-500/80 to-blue-600/80 backdrop-blur-xl rounded-3xl p-8 text-white shadow-lg border border-white/20">
               <h3 className="text-blue-100 font-medium mb-2 uppercase text-sm tracking-wider">Today's Activity</h3>
               <div className="text-5xl font-bold mb-1 drop-shadow-md">{sales.filter(t => t.date.startsWith(new Date().toISOString().split('T')[0])).length}</div>
               <div className="text-blue-100 text-sm font-medium">Orders Processed Today</div>
           </div>
           
           <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-white/50 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-300 mb-4 shadow-sm">
                   <ShieldAlert size={32} />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Limited Access</h3>
               <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xs">
                 Financial analytics and advanced insights are restricted to Manager and Admin accounts.
               </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Dashboard</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Financial overview & analytics</p>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-indigo-600/90 to-blue-600/90 backdrop-blur-xl rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/20">
        <div className="absolute top-0 right-0 p-8 opacity-20">
           <Sparkles size={140} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="text-yellow-300" size={18} />
            </div>
            <h3 className="font-bold uppercase tracking-wider text-xs text-indigo-100">Gemini Smart Insights</h3>
          </div>
          <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95 max-w-3xl">
            {loadingInsight ? (
              <span className="animate-pulse">Analyzing sales patterns...</span>
            ) : (
              insight
            )}
          </p>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg group">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-4 bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Net Revenue</p>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{renderDualCurrency(netRevenue)}</div>
                </div>
            </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg group">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <ShoppingBag size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Sales</p>
                    <h4 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{totalOrders}</h4>
                </div>
            </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg group">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Avg. Order</p>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{renderDualCurrency(avgOrderValue)}</div>
                </div>
            </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg group">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <Package size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Est. Stock Profit</p>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{renderDualCurrency(potentialProfit)}</div>
                </div>
            </div>
        </div>
      </div>

      {/* Profit & Loss Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Gross Profit */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg flex flex-col justify-between">
               <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Gross Profit</p>
               <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{renderDualCurrency(grossProfit)}</div>
                  <p className="text-xs text-slate-400 mt-1">Net Rev - Net COGS</p>
               </div>
            </div>
            
            {/* Total Expenses */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg flex flex-col justify-between">
               <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Total Expenses</p>
               <div>
                  <div className="text-2xl font-bold text-red-500 dark:text-red-400">{renderDualCurrency(totalExpenses)}</div>
                  <p className="text-xs text-slate-400 mt-1">Operational costs</p>
               </div>
            </div>

            {/* Net Profit */}
            <div className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border shadow-lg flex flex-col justify-between relative overflow-hidden group ${netProfit >= 0 ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handleForecastProfit} 
                    disabled={isForecasting}
                    className="p-2 bg-white/50 dark:bg-black/20 rounded-full hover:bg-white dark:hover:bg-black/40 transition-colors text-indigo-600 dark:text-indigo-400 border border-transparent hover:border-indigo-500/30"
                    title="Estimate Future Profit"
                  >
                    {isForecasting ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                  </button>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Net Profit</p>
               <div>
                  <div className="flex items-center gap-2">
                     <div className={`text-3xl font-extrabold ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {renderDualCurrency(netProfit)}
                     </div>
                     <div className="ml-auto">
                        {netProfit >= 0 ? <ArrowUpRight className="text-emerald-500" size={24} /> : <ArrowDownRight className="text-red-500" size={24} />}
                     </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Gross Profit - Expenses</p>
               </div>
               {profitForecast && (
                 <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-indigo-600 dark:text-indigo-300 animate-fade-in">
                    <div className="flex items-center gap-1 font-bold mb-1"><Sparkles size={10}/> AI Projection (30d)</div>
                    {profitForecast}
                 </div>
               )}
            </div>
         </div>

         {/* Expense Chart */}
         <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg flex flex-col">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
               <PieChartIcon size={18} className="text-primary"/> Expense Breakdown
            </h3>
            <div className="flex-1 min-h-[200px]">
               {expenseChartData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={expenseChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {expenseChartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} stroke="none" />
                          ))}
                       </Pie>
                       <Tooltip 
                          contentStyle={{ 
                             borderRadius: '12px', 
                             backgroundColor: tooltipBg,
                             border: 'none',
                             boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                             color: tooltipText
                          }}
                          itemStyle={{ color: tooltipText }}
                          formatter={(value: number) => `$${formatCurrency(value)}`}
                       />
                       <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px'}} />
                    </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm">No expenses recorded</div>
               )}
            </div>
         </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg h-96">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
           <TrendingUp size={20} className="text-primary"/>
           Net Revenue (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: axisTextColor, fontSize: 12, fontWeight: 500}} 
              dy={15} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: axisTextColor, fontSize: 12, fontWeight: 500}} 
              tickFormatter={(val) => `$${val}`} 
              dx={-10}
            />
            <Tooltip 
                cursor={{stroke: isDarkMode ? '#475569' : '#cbd5e1', strokeWidth: 2}}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
                  backgroundColor: tooltipBg,
                  backdropFilter: 'blur(8px)',
                  color: tooltipText,
                  padding: '12px'
                }}
                itemStyle={{ color: '#2563eb', fontWeight: 700 }}
                labelStyle={{ color: isDarkMode ? '#cbd5e1' : '#64748b', marginBottom: '4px', fontSize: '12px' }}
                formatter={(value: number) => [`$${formatCurrency(value)}`, 'Sales']}
            />
            <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" activeDot={{r: 6, strokeWidth: 0, fill: '#2563eb'}} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
