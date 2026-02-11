import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import NetworkDashboard from './pages/NetworkDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />; // Redirect to home/dashboard if role mismatch

  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'student') return <Navigate to="/student-dashboard" />;
  if (user.role === 'network_team') return <Navigate to="/network-dashboard" />;
  if (user.role === 'faculty') return <Navigate to="/faculty-dashboard" />;
  return <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50/50 text-[#0F172A] font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<DashboardRedirect />} />

                <Route path="/student-dashboard" element={
                  <PrivateRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </PrivateRoute>
                } />

                <Route path="/network-dashboard" element={
                  <PrivateRoute allowedRoles={['network_team']}>
                    <NetworkDashboard />
                  </PrivateRoute>
                } />

                <Route path="/faculty-dashboard" element={
                  <PrivateRoute allowedRoles={['faculty']}>
                    <FacultyDashboard />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
