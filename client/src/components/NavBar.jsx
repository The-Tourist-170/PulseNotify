import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, Shield, LineChart, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Rss } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors border border-transparent hover:bg-gray-200 hover:border-white hover:rounded-lg";
  const activeLinkStyle = "bg-blue-700 text-gray-900 transition-colors hover:bg-primary-500";

  return (
    <header className="bg-gray-50 shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <motion.div
          animate={{
            rotate: [0, -1, 1, -1, 1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="glass p-2 w-fit"
        >
          <NavLink to="/" className="text-3xl font-bold flex items-center justify-between">
            <span className="bg-gradient-to-r from-violet-500 via-cyan-600 to-primary-600 text-transparent bg-clip-text">
              PulseNotify
            </span>
            <div className='p-1 text-blue-500'>
              <Rss />
            </div>
          </NavLink>
        </motion.div>
        <div className="flex items-center gap-4 text-gray-600">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                    <Shield size={18} /> Admin Dashboard
                  </NavLink>
                  <NavLink to="/admin/analytics" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                    <LineChart size={18} /> Analytics
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                    <Home size={18} /> Active Alerts
                  </NavLink>
                </>
              )}
              <NavLink to="/snoozed" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                <Bell size={18} /> Snoozed
              </NavLink>
              <span className="text-gray-500">|</span>
              <span className="text-gray-500">Welcome, {user?.name}</span>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#4b5563' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;