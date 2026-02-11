import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Monitor } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-surface shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-primary font-bold text-xl">
                    <Monitor className="w-6 h-6" />
                    <Link to="/" className="hover:text-blue-700 transition-colors">LabIssueTracker</Link>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="flex items-center space-x-2">
                        <NotificationBell />
                        <div className="hidden md:block text-sm font-medium text-gray-600 border-l border-gray-200 pl-4 ml-2">
                            <span className="capitalize px-2 py-1 bg-gray-50 rounded-md border border-gray-200 text-xs text-gray-500">
                                {user.role.replace('_', ' ')}
                            </span>
                            <span className="ml-2 text-secondary font-bold">{user.username}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
