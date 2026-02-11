import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle, Clock, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const NetworkDashboard = () => {
    const { addToast } = useToast();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tickets');
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            addToast('Failed to load tickets', 'error');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}`, { status: newStatus });
            fetchTickets();
            addToast(`Ticket status updated to ${newStatus}`, 'success');
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.msg || 'Failed to update status', 'error');
        }
    };

    const filteredTickets = filter === 'All'
        ? tickets
        : tickets.filter(t => t.status === filter);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#0F172A] flex items-center tracking-tight">
                        <Wrench className="w-8 h-8 mr-3 text-[#0F172A]" />
                        Issue Management
                    </h2>
                    <p className="text-gray-500 mt-1 ml-11">Track and resolve technical issues.</p>
                </div>

                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex space-x-1 overflow-x-auto max-w-full">
                    {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${filter === status
                                ? 'bg-[#0F172A] text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F172A]"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl card-shadow border border-gray-100/50 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">PC / IP</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Reported By</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTickets.map(ticket => (
                                    <tr key={ticket._id}>
                                        <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-400 font-medium">{new Date(ticket.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            <div className="font-bold text-[#0F172A]">{ticket.pcNumber || 'N/A'}</div>
                                            <div className="text-xs text-gray-500 font-mono">{ticket.ipAddress}</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mr-2">
                                                    {(ticket.reportedBy?.username || '?').charAt(0).toUpperCase()}
                                                </div>
                                                {ticket.reportedBy?.username || <span className="text-gray-400 italic">Unknown</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm relative">
                                            <div className="flex items-center">
                                                <div className="font-bold text-[#0F172A]">{ticket.issueType}</div>
                                                {ticket.isUrgent && ticket.status !== 'Resolved' && (
                                                    <span className="ml-2 px-2 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full animate-pulse">
                                                        URGENT
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {ticket.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm
                                                ${ticket.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                    ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                        'bg-green-50 text-green-700 border border-green-100'}`}>
                                                {ticket.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-3">
                                                {ticket.status === 'Open' && (
                                                    <button
                                                        onClick={() => updateStatus(ticket._id, 'In Progress')}
                                                        className="text-xs font-bold bg-[#0F172A] text-white px-3 py-1.5 rounded-lg hover:bg-[#1E293B] transition-colors shadow-sm"
                                                    >
                                                        Start Work
                                                    </button>
                                                )}
                                                {ticket.status === 'In Progress' && (
                                                    <button
                                                        onClick={() => updateStatus(ticket._id, 'Resolved')}
                                                        className="text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
                                                    >
                                                        Mark Resolved
                                                    </button>
                                                )}
                                                {ticket.status === 'Resolved' && (
                                                    <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-3 py-1.5 rounded-lg">
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Done
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile & Tablet Card View */}
                    <div className="lg:hidden p-4 bg-gray-50/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTickets.map(ticket => (
                            <div key={ticket._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm
                                            ${ticket.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                    'bg-green-50 text-green-700 border border-green-100'}`}>
                                            {ticket.status.toUpperCase()}
                                        </span>
                                        {ticket.isUrgent && ticket.status !== 'Resolved' && (
                                            <span className="px-2 py-1 text-[10px] font-bold text-white bg-red-600 rounded-full animate-pulse">
                                                URGENT
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-bold text-[#0F172A] mb-1">{ticket.issueType} Issue</h3>
                                <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                                    <div className="bg-gray-50 p-2 rounded-lg">
                                        <div className="font-bold text-gray-500 mb-1">PC / IP</div>
                                        <div className="font-mono text-[#0F172A]">{ticket.pcNumber || ticket.ipAddress}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg">
                                        <div className="font-bold text-gray-500 mb-1">Reported By</div>
                                        <div className="text-[#0F172A]">{ticket.reportedBy?.username || 'Unknown'}</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    {ticket.status === 'Open' && (
                                        <button
                                            onClick={() => updateStatus(ticket._id, 'In Progress')}
                                            className="w-full text-xs font-bold bg-[#0F172A] text-white px-4 py-3 rounded-xl hover:bg-[#1E293B] transition-colors shadow-sm"
                                        >
                                            Start Work
                                        </button>
                                    )}
                                    {ticket.status === 'In Progress' && (
                                        <button
                                            onClick={() => updateStatus(ticket._id, 'Resolved')}
                                            className="w-full text-xs font-bold bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    {ticket.status === 'Resolved' && (
                                        <span className="w-full justify-center text-xs font-bold text-green-600 flex items-center bg-green-50 px-4 py-3 rounded-xl">
                                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Done
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NetworkDashboard;
