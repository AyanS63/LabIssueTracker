import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Configure axios default header
                    axios.defaults.headers.common['x-auth-token'] = token;
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`);
                    setUser(res.data);
                } catch (error) {
                    console.error('Auth verification failed', error);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['x-auth-token'];
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (username, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { username, password });
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;

        // Fetch user details immediately to get role and populate state
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`);
        setUser(userRes.data);
        return userRes.data;
    };

    const register = async (username, password, role, fullName) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { username, password, role, fullName });
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;

        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`);
        setUser(userRes.data);
        return userRes.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
