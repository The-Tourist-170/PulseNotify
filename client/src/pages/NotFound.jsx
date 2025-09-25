import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[70vh]">
      <motion.h1 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-9xl font-extrabold text-primary-500"
      >
        404
      </motion.h1>
      <p className="text-2xl md:text-3xl font-light text-gray-500 mt-4">
        Oops! Page not found.
      </p>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;