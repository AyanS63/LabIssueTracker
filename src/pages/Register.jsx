import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'student', fullName: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.password, formData.role, formData.fullName);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50/50 py-10">
            <div className="w-full max-w-[480px] bg-white p-10 rounded-3xl shadow-xl card-shadow border border-gray-100/50">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F172A] mb-6 shadow-lg shadow-gray-200">
                        <UserPlus className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Create your account</h2>
                    <p className="text-gray-500 mt-3 text-[15px]">Join the next generation of lab management.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
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
                        <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">Account Role</label>
                        <div className="relative">
                            <select
                                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200 appearance-none"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="student">Student Account</option>
                                <option value="network_team">Network Team</option>
                                <option value="faculty">Faculty</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="Min. 6 characters"
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
                        Create Account
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>

                <div className="mt-8 text-center text-[15px] text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#0F172A] font-bold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
