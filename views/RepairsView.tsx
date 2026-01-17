
import React, { useState, useEffect } from 'react';
import { RepairTicket, Customer, StoreSettings, User } from '../types';
import { Wrench, Plus, Search, Calendar, Phone, CheckCircle2, Clock, AlertCircle, X, Printer, User as UserIcon, Smartphone, FileText, Trash2, Edit } from 'lucide-react';
import { useToast } from '../components/Toast';

interface RepairsViewProps {
  repairs: RepairTicket[];
  customers: Customer[];
  onAddRepair: (repair: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRepair: (repair: RepairTicket) => void;
  onDeleteRepair: (id: string) => void;
  settings: StoreSettings;
  currentUser: User;
}

const statusColors: Record<string, string> = {
  'Received': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'In Progress': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'Waiting for Parts': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Ready': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Completed': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  'Cancelled': 'bg-red-500/10 text-red-600 border-red-500/20',
};

const RepairTicketPrint = ({ ticket, settings, onClose }: { ticket: RepairTicket, settings: StoreSettings, onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden animate-fade-in">
        <div className="relative flex flex-col items-center w-full max-w-sm">
            <div className="flex gap-2 mb-4 shrink-0">
                <button onClick={() => window.print()} className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors">
                    <Printer size={16} /> Print
                </button>
                <button onClick={onClose} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            {/* Ticket to Print */}
            <div className="bg-white text-black p-6 w-[80mm] shadow-2xl rounded-sm font-mono text-xs leading-tight print:w-full print:absolute print:top-0 print:left-0 print:m-0 print:h-auto print:shadow-none">
                <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
                    <h1 className="text-xl font-bold uppercase mb-1">{settings.storeName}</h1>
                    <p>REPAIR SERVICE TICKET</p>
                    <p className="mt-2 text-[10px]">{new Date().toLocaleString()}</p>
                </div>

                <div className="mb-4">
                    <p className="font-bold text-lg text-center border-2 border-black p-2 mb-2">#{ticket.id.slice(-6).toUpperCase()}</p>
                    <div className="space-y-1">
                        <div className="flex justify-between"><span>Date:</span><span>{new Date(ticket.createdAt).toLocaleDateString()}</span></div>
                        <div className="flex justify-between font-bold"><span>Status:</span><span className="uppercase">{ticket.status}</span></div>
                    </div>
                </div>

                <div className="border-b-2 border-dashed border-black pb-4 mb-4">
                    <p className="font-bold mb-1 border-b border-black inline-block">CUSTOMER</p>
                    <p>{ticket.customerName}</p>
                    <p>{ticket.customerPhone}</p>
                </div>

                <div className="border-b-2 border-dashed border-black pb-4 mb-4">
                    <p className="font-bold mb-1 border-b border-black inline-block">DEVICE DETAILS</p>
                    <p className="font-bold">{ticket.deviceName}</p>
                    <p className="mt-1"><span className="font-bold">Issue:</span> {ticket.issueDescription}</p>
                    {ticket.serialNumber && <p className="mt-1">SN: {ticket.serialNumber}</p>}
                </div>

                <div className="text-right space-y-1 mb-6">
                    <div className="flex justify-between"><span>Est. Cost:</span><span>{settings.currency}{ticket.estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    {ticket.deposit > 0 && <div className="flex justify-between"><span>Deposit Paid:</span><span>-{settings.currency}{ticket.deposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>}
                    <div className="flex justify-between font-bold text-sm border-t border-black pt-1 mt-1"><span>Due:</span><span>{settings.currency}{(ticket.estimatedCost - ticket.deposit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                </div>

                <div className="text-center text-[10px]">
                    <p className="mb-4">Bring this ticket to claim your device.</p>
                    <p>Terms & Conditions apply.</p>
                    <p>Not responsible for data loss.</p>
                </div>
            </div>
        </div>
    </div>
);

const RepairModal = ({ isOpen, onClose, ticket, onSave, customers }: { isOpen: boolean, onClose: () => void, ticket: RepairTicket | null, onSave: (t: any) => void, customers: Customer[] }) => {
    const [formData, setFormData] = useState<Partial<RepairTicket>>({
        customerName: '',
        customerPhone: '',
        deviceName: '',
        serialNumber: '',
        issueDescription: '',
        estimatedCost: 0,
        deposit: 0,
        status: 'Received',
        notes: ''
    });
    const [customerSearch, setCustomerSearch] = useState('');

    useEffect(() => {
        if (ticket) {
            setFormData(ticket);
        } else {
            setFormData({
                customerName: '',
                customerPhone: '',
                deviceName: '',
                serialNumber: '',
                issueDescription: '',
                estimatedCost: 0,
                deposit: 0,
                status: 'Received',
                notes: ''
            });
        }
    }, [ticket, isOpen]);

    const selectCustomer = (c: Customer) => {
        setFormData(prev => ({ ...prev, customerId: c.id, customerName: c.name, customerPhone: c.phone }));
        setCustomerSearch('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/10">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{ticket ? 'Edit Ticket' : 'New Repair Ticket'}</h3>
                    <button onClick={onClose}><X size={22} /></button>
                </div>
                
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Customer Selection */}
                    {!ticket && (
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Customer</label>
                             <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                                <input 
                                    placeholder="Search existing or type new name..." 
                                    className="w-full pl-10 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none"
                                    value={formData.customerName}
                                    onChange={e => { setFormData({...formData, customerName: e.target.value}); setCustomerSearch(e.target.value); }}
                                />
                                {customerSearch && !formData.customerId && (
                                    <div className="absolute w-full bg-white dark:bg-slate-800 shadow-xl rounded-xl mt-1 z-10 max-h-32 overflow-y-auto border border-white/20">
                                        {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                                            <div key={c.id} onClick={() => selectCustomer(c)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm">
                                                <div className="font-bold">{c.name}</div>
                                                <div className="text-xs text-slate-500">{c.phone}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>
                             <input 
                                placeholder="Phone Number" 
                                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none"
                                value={formData.customerPhone}
                                onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                             />
                        </div>
                    )}
                    
                    {/* Device Details */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Device Info</label>
                        <div className="grid grid-cols-2 gap-3">
                            <input placeholder="Device Name (e.g. iPhone 13)" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={formData.deviceName} onChange={e => setFormData({...formData, deviceName: e.target.value})} />
                            <input placeholder="Serial No. / IMEI" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Issue Description</label>
                        <textarea rows={3} className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={formData.issueDescription} onChange={e => setFormData({...formData, issueDescription: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500 uppercase">Estimated Cost</label>
                             <input type="number" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={formData.estimatedCost} onChange={e => setFormData({...formData, estimatedCost: parseFloat(e.target.value)})} />
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500 uppercase">Deposit</label>
                             <input type="number" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={formData.deposit} onChange={e => setFormData({...formData, deposit: parseFloat(e.target.value)})} />
                        </div>
                    </div>

                    {ticket && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                            <select className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Internal Notes</label>
                        <textarea rows={2} className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-white/10 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-white/30">Cancel</button>
                    <button onClick={() => onSave(formData)} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">{ticket ? 'Update Ticket' : 'Create Ticket'}</button>
                </div>
            </div>
        </div>
    );
}

export const RepairsView: React.FC<RepairsViewProps> = ({ repairs, customers, onAddRepair, onUpdateRepair, onDeleteRepair, settings, currentUser }) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<RepairTicket | null>(null);
  const [printingTicket, setPrintingTicket] = useState<RepairTicket | null>(null);
  const { showToast } = useToast();

  const filteredRepairs = repairs.filter(r => {
      const matchesStatus = filter === 'All' || r.status === filter;
      const matchesSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || r.deviceName.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search);
      return matchesStatus && matchesSearch;
  });

  const handleSave = (data: any) => {
      if(!data.customerName || !data.deviceName || !data.issueDescription) {
          showToast('Please fill in required fields', 'error');
          return;
      }
      if (editingTicket) {
          onUpdateRepair({ ...editingTicket, ...data });
          showToast('Repair ticket updated', 'success');
      } else {
          onAddRepair(data);
          showToast('Repair ticket created', 'success');
      }
      setIsModalOpen(false);
      setEditingTicket(null);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Delete this repair ticket?')) {
          onDeleteRepair(id);
          showToast('Ticket deleted', 'info');
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Repair Service</h2>
           <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Manage service tickets & device status</p>
        </div>
        <button onClick={() => { setEditingTicket(null); setIsModalOpen(true); }} className="bg-primary text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-bold backdrop-blur-md">
           <Plus size={20} /> <span className="hidden sm:inline">New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)]">
         {/* Filters Sidebar */}
         <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-4 border border-white/30 dark:border-white/10 h-fit lg:h-full flex flex-col gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                <input placeholder="Search tickets..." className="w-full pl-10 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none text-sm" value={search} onChange={e => setSearch(e.target.value)} />
             </div>
             
             <div className="flex-1 overflow-x-auto lg:overflow-y-auto flex lg:flex-col gap-2 no-scrollbar">
                <button onClick={() => setFilter('All')} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap ${filter === 'All' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/30 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'}`}>All Tickets <span className="float-right opacity-60 ml-2">{repairs.length}</span></button>
                {Object.keys(statusColors).map(status => (
                    <button key={status} onClick={() => setFilter(status)} className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap ${filter === status ? 'bg-white text-slate-900 shadow-lg' : 'hover:bg-white/30 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'}`}>
                        <span className={`w-2 h-2 rounded-full inline-block mr-2 ${statusColors[status].split(' ')[1].replace('text', 'bg')}`}></span>
                        {status} 
                        <span className="float-right opacity-60 ml-2">{repairs.filter(r => r.status === status).length}</span>
                    </button>
                ))}
             </div>
         </div>

         {/* Ticket List */}
         <div className="lg:col-span-3 overflow-y-auto no-scrollbar pb-20">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {filteredRepairs.length === 0 ? (
                     <div className="col-span-full text-center py-20 text-slate-400">No tickets found</div>
                 ) : (
                     filteredRepairs.map(ticket => (
                         <div key={ticket.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-white/30 dark:border-white/10 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full">
                             <div>
                                 <div className="flex justify-between items-start mb-3">
                                     <span className="font-mono text-xs font-bold text-slate-400">#{ticket.id.slice(-6)}</span>
                                     <span className={`px-2 py-1 rounded-lg text-[10px] uppercase font-extrabold border ${statusColors[ticket.status]}`}>{ticket.status}</span>
                                 </div>
                                 <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{ticket.deviceName}</h3>
                                 <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">{ticket.issueDescription}</p>
                                 
                                 <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-black/20 p-3 rounded-xl">
                                     <div className="flex items-center gap-2"><UserIcon size={12}/> <span className="font-bold">{ticket.customerName}</span></div>
                                     <div className="flex items-center gap-2"><Smartphone size={12}/> {ticket.customerPhone}</div>
                                     <div className="flex items-center gap-2"><Calendar size={12}/> {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                 </div>
                             </div>

                             <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/5 flex items-center justify-between">
                                 <div>
                                     <p className="text-[10px] text-slate-400 uppercase font-bold">Estimated Cost</p>
                                     <p className="font-bold text-slate-800 dark:text-slate-100">{settings.currency}{ticket.estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                 </div>
                                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => setPrintingTicket(ticket)} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg" title="Print Ticket"><Printer size={16}/></button>
                                     <button onClick={() => { setEditingTicket(ticket); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg" title="Edit"><Edit size={16}/></button>
                                     <button onClick={() => handleDelete(ticket.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg" title="Delete"><Trash2 size={16}/></button>
                                 </div>
                             </div>
                         </div>
                     ))
                 )}
             </div>
         </div>
      </div>

      <RepairModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} ticket={editingTicket} onSave={handleSave} customers={customers} />
      
      {printingTicket && (
          <RepairTicketPrint ticket={printingTicket} settings={settings} onClose={() => setPrintingTicket(null)} />
      )}
    </div>
  );
};
