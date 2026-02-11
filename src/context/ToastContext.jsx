import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-5 right-5 z-[9999] space-y-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center p-4 rounded-xl shadow-lg card-shadow border backdrop-blur-sm animate-slide-in min-w-[300px] transform transition-all duration-300
                            ${toast.type === 'success' ? 'bg-white border-green-100' :
                                toast.type === 'error' ? 'bg-white border-red-100' :
                                    'bg-white border-blue-100'}`}
                    >
                        <div className={`p-2 rounded-full mr-3
                            ${toast.type === 'success' ? 'bg-green-50 text-green-600' :
                                toast.type === 'error' ? 'bg-red-50 text-red-600' :
                                    'bg-blue-50 text-blue-600'}`}>
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            {toast.type === 'info' && <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-sm font-bold
                                ${toast.type === 'success' ? 'text-gray-900' :
                                    toast.type === 'error' ? 'text-gray-900' :
                                        'text-gray-900'}`}>
                                {toast.type === 'success' ? 'Success' :
                                    toast.type === 'error' ? 'Error' : 'Info'}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 ml-3"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
