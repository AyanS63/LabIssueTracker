import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`);
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    // Poll for notifications every 10 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/notifications/clear`);
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Notifications"
            >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-secondary">Notifications</h3>
                            {unreadCount > 0 && <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-medium">{unreadCount} new</span>}
                        </div>
                        <div className="flex space-x-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:text-blue-700 font-medium"
                                >
                                    Mark read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(n => (
                                    <div
                                        key={n._id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                                        onClick={() => !n.read && markAsRead(n._id)}
                                    >
                                        <p className="text-sm text-gray-700 mb-1">{n.message}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">
                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {!n.read && (
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
