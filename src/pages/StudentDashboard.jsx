import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Clock, CheckCircle, AlertCircle, Monitor } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const StudentDashboard = () => {
    const { addToast } = useToast();
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({
        ipAddress: '',
        pcNumber: '',
        issueType: 'Hardware',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [feedbackData, setFeedbackData] = useState({ rating: 5, feedback: '' });

    const openFeedbackModal = (ticket) => {
        setSelectedTicket(ticket);
        setFeedbackData({ rating: 5, feedback: '' });
        setShowFeedbackModal(true);
    };

    const submitFeedback = async () => {
        if (!selectedTicket) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/tickets/${selectedTicket._id}/feedback`, feedbackData);
            setShowFeedbackModal(false);
            fetchTickets();
            addToast('Feedback submitted successfully!', 'success');
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.msg || 'Failed to submit feedback', 'error');
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchIp();
    }, []);

    const fetchIp = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-ip`);
            setNewTicket(prev => ({ ...prev, ipAddress: res.data.ip }));
        } catch (err) {
            console.error('Failed to fetch IP', err);
            setNewTicket(prev => ({ ...prev, ipAddress: 'Unable to detect IP' }));
        }
    };

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets/my`);
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            addToast('Failed to load tickets', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/tickets`, newTicket);
            setNewTicket({ ...newTicket, description: '', pcNumber: '' });
            fetchTickets();
            addToast('Issue reported successfully. Support team notified.', 'success');
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.msg || 'Failed to report issue', 'error');
        }
        setSubmitting(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'text-red-600 bg-red-50 border border-red-100';
            case 'In Progress': return 'text-amber-600 bg-amber-50 border border-amber-100';
            case 'Resolved': return 'text-green-600 bg-green-50 border border-green-100';
            default: return 'text-gray-600 bg-gray-50 border border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Student Dashboard</h1>
                <p className="text-gray-500 mt-2">Report technical issues and track their status.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Report Issue Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-xl card-shadow border border-gray-100/50 sticky top-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-[#0F172A] rounded-xl shadow-lg shadow-gray-200">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-[#0F172A]">Report Issue</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">IP Address</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-500 font-medium cursor-not-allowed"
                                        value={newTicket.ipAddress}
                                        readOnly
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                                        <Monitor className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">PC Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. LAB-01-PC-05"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200"
                                    value={newTicket.pcNumber}
                                    onChange={(e) => setNewTicket({ ...newTicket, pcNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">Issue Type</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200 appearance-none"
                                        value={newTicket.issueType}
                                        onChange={(e) => setNewTicket({ ...newTicket, issueType: e.target.value })}
                                    >
                                        <option>Hardware</option>
                                        <option>Software</option>
                                        <option>Network</option>
                                        <option>Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">Description</label>
                                <textarea
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200"
                                    rows="4"
                                    placeholder="Describe the issue in detail..."
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1E293B] transition-all duration-200 shadow-lg shadow-gray-200 flex items-center justify-center space-x-2 group"
                            >
                                {submitting ? (
                                    <span>Submitting...</span>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                                        <span>Submit Ticket</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* My Tickets Section */}
                <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            <Clock className="w-5 h-5 text-[#0F172A]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#0F172A]">My Reported Issues</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F172A]"></div>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                                <AlertCircle className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-[#0F172A]">No issues reported</h3>
                            <p className="text-gray-500 mt-1">Your submitted tickets will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {tickets.map(ticket => (
                                <div key={ticket._id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:card-shadow border border-gray-100/50 transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.toUpperCase()}
                                        </span>
                                        <span className="text-xs font-medium text-gray-400">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-[#0F172A] mb-2 text-lg group-hover:text-blue-600 transition-colors">{ticket.issueType} Issue</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{ticket.description}</p>

                                    <div className="flex items-center justify-between text-xs font-medium text-gray-400 pt-4 border-t border-gray-50">
                                        <div className="flex items-center">
                                            <Monitor className="w-3.5 h-3.5 mr-1.5" />
                                            {ticket.pcNumber || 'N/A'}
                                        </div>
                                        <span>{ticket.ipAddress}</span>
                                    </div>

                                    {/* Feedback Section */}
                                    {ticket.status === 'Resolved' && !ticket.feedback && (
                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                            <button
                                                onClick={() => openFeedbackModal(ticket)}
                                                className="w-full text-xs font-bold bg-[#0F172A] text-white py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors shadow-md shadow-gray-200"
                                            >
                                                Give Feedback
                                            </button>
                                        </div>
                                    )}
                                    {ticket.feedback && (
                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                            <div className="bg-yellow-50/50 rounded-xl p-3 border border-yellow-100/50">
                                                <div className="flex items-center text-yellow-500 mb-1">
                                                    {'★'.repeat(ticket.rating)}{'☆'.repeat(5 - ticket.rating)}
                                                </div>
                                                <p className="text-xs text-gray-600 italic">"{ticket.feedback}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && selectedTicket && (
                <div className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl card-shadow border border-gray-100 transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 mb-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0F172A]">Rate Resolution</h3>
                            <p className="text-sm text-gray-500 mt-1">How was the {selectedTicket.issueType.toLowerCase()} issue handled?</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-center space-x-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                                        className={`text-3xl transition-all duration-200 hover:scale-110 ${feedbackData.rating >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">Your Feedback</label>
                                <textarea
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200"
                                    rows="3"
                                    placeholder="Help us improve with your comments..."
                                    value={feedbackData.feedback}
                                    onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => setShowFeedbackModal(false)}
                                    className="px-4 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitFeedback}
                                    className="px-4 py-3 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-[#1E293B] transition-colors shadow-lg shadow-gray-200"
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
