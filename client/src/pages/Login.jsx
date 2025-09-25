import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.login({
        name,
        password,
      });
      login(response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className='flex items-center justify-center maz-h-screen bg-gray-100'>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.3 } 
        }}
        className="w-full max-w-md p-8 space-y-6 bg-gray-50 rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Username</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-3 py-2 mt-1 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div> 
          <div>
            <label className="block text-sm font-medium text-gray-500">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-3 py-2 mt-1 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 font-semibold text-white bg-blue-700 rounded-lg hover:bg-primary-700 transition-colors">
            Login
          </motion.button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <Link to="/register" className="font-medium text-primary-500 hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};


export default Login;