import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const FacultyDashboard = () => {
    const { addToast } = useToast();
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets`);
            const tickets = res.data;

            const stats = tickets.reduce((acc, ticket) => {
                acc.total++;
                if (ticket.status === 'Open') acc.open++;
                if (ticket.status === 'In Progress') acc.inProgress++;
                if (ticket.status === 'Resolved') acc.resolved++;
                return acc;
            }, { total: 0, open: 0, inProgress: 0, resolved: 0 });

            setStats(stats);
            setRecentTickets(tickets.slice(0, 5)); // Get last 5 tickets
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            addToast('Failed to load dashboard data', 'error');
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, bgColor, borderColor }) => (
        <div className={`bg-white p-6 rounded-3xl shadow-sm hover:card-shadow transition-all duration-300 border ${borderColor}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">{title}</p>
                    <h3 className="text-4xl font-bold text-[#0F172A]">{value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${bgColor}`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                </div>
            </div>
        </div>
    );

    const getDuration = (start, end) => {
        if (!start || !end) return '';
        const diff = new Date(end) - new Date(start);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Faculty Dashboard</h2>
                <p className="text-gray-500 mt-2">Overview of lab issues and performance metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Issues"
                    value={stats.total}
                    icon={AlertTriangle}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
                <StatCard
                    title="Open Issues"
                    value={stats.open}
                    icon={AlertTriangle}
                    color="text-red-600"
                    bgColor="bg-red-50"
                    borderColor="border-red-100"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    icon={Users}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                    borderColor="border-amber-100"
                />
                <StatCard
                    title="Resolved"
                    value={stats.resolved}
                    icon={CheckCircle}
                    color="text-green-600"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-xl card-shadow border border-gray-100/50 p-5 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
                    <h3 className="text-xl font-bold text-[#0F172A]">Issues</h3>
                </div>

                <div className="space-y-4">
                    {recentTickets.map(ticket => (
                        <div key={ticket._id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white hover:card-shadow transition-all duration-300">
                            <div className="flex items-start space-x-3 md:space-x-5 w-full">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 shadow-sm mt-1.5 ${ticket.status === 'Resolved' ? 'bg-green-500 shadow-green-200' :
                                    ticket.status === 'In Progress' ? 'bg-amber-500 shadow-amber-200' : 'bg-red-500 shadow-red-200'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-base font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                                        {ticket.issueType} Issue <span className="text-gray-400 font-normal mx-2 hidden sm:inline">|</span> <span className="font-medium text-gray-600 block sm:inline mt-1 sm:mt-0">{ticket.pcNumber || ticket.ipAddress}</span>
                                    </p>
                                    <div className="flex flex-wrap items-center mt-1 gap-x-3 gap-y-1 text-xs text-gray-500">
                                        <span>Reported by <span className="font-bold text-gray-700">{ticket.reportedBy?.username || 'Unknown'}</span></span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                                        <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                                    </div>

                                    {ticket.status === 'Resolved' && ticket.resolvedAt && (
                                        <div className="text-xs font-medium text-green-600 mt-2 flex items-center bg-green-50 w-fit px-2 py-1 rounded-md">
                                            <CheckCircle className="w-3 h-3 mr-1.5" />
                                            Resolved in {getDuration(ticket.createdAt, ticket.resolvedAt)}
                                        </div>
                                    )}
                                    {/* Urgency Button */}
                                    {ticket.status !== 'Resolved' && new Date(ticket.createdAt) < new Date(Date.now() - 2 * 60 * 1000) && !ticket.isUrgent && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await axios.put(`${import.meta.env.VITE_API_URL}/api/tickets/${ticket._id}/urgent`);
                                                    fetchData();
                                                    addToast('Ticket marked as URGENT!', 'success');
                                                } catch (err) {
                                                    console.error(err);
                                                    addToast(err.response?.data?.msg || 'Failed to mark urgent', 'error');
                                                }
                                            }}
                                            className="mt-3 sm:mt-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm shadow-red-200 animate-pulse w-full sm:w-auto"
                                        >
                                            Make it Fast! ⚡
                                        </button>
                                    )}
                                    {ticket.isUrgent && ticket.status !== 'Resolved' && (
                                        <div className="mt-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 inline-flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" /> Marked Urgent
                                        </div>
                                    )}

                                    {ticket.feedback && (
                                        <div className="mt-2 text-xs text-gray-500 bg-yellow-50/50 border border-yellow-100 px-3 py-2 rounded-lg inline-block w-full sm:w-auto">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 mr-2 text-sm">
                                                    {'★'.repeat(ticket.rating)}{'☆'.repeat(5 - ticket.rating)}
                                                </span>
                                                <span className="italic">"{ticket.feedback}"</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className={`self-start sm:self-center mt-3 sm:mt-0 ml-8 sm:ml-0 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${ticket.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-100' :
                                ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {ticket.status.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
