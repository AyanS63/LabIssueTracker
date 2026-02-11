import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.username, formData.password);
            // Navigation handled by App.jsx or DashboardRedirect component
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
            <div className="w-full max-w-[440px] bg-white p-10 rounded-3xl shadow-xl card-shadow border border-gray-100/50">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F172A] mb-6 shadow-lg shadow-gray-200">
                        <Monitor className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Welcome back</h2>
                    <p className="text-gray-500 mt-3 text-[15px]">Enter your credentials to access the lab.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2 ml-1">
                            <label className="block text-sm font-bold text-[#0F172A]">Password</label>
                            <a href="#" className="text-xs font-medium text-gray-500 hover:text-[#0F172A] transition-colors"></a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-semibold hover:bg-[#1E293B] transition-all duration-200 shadow-lg shadow-gray-200 flex items-center justify-center group"
                    >
                        Sign In
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>

                <div className="mt-8 text-center text-[15px] text-gray-500">
                    New to the portal?{' '}
                    <Link to="/register" className="text-[#0F172A] font-bold hover:underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
