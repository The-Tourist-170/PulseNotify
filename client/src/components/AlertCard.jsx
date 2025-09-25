import { motion } from 'framer-motion';
import { Info, AlertTriangle, AlertOctagon, CheckCircle, BellOff, Edit } from 'lucide-react';
import { useState } from 'react';

const severityConfig = {
  INFO: { icon: <Info />, color: 'bg-blue-500', shape: 'rounded-lg' },
  WARNING: { icon: <AlertTriangle />, color: 'bg-yellow-500', shape: 'rounded-xl rounded-b-md' },
  CRITICAL: { icon: <AlertOctagon />, color: 'bg-red-500', shape: 'rounded-2xl' },
};

const AlertCard = ({ alert, onRead, onSnooze, onEdit, isAdmin = false }) => {
  const config = severityConfig[alert.severity] || severityConfig.INFO;
  const [isRead, setIsRead] = useState(alert.status === 'READ');

  const handleReadClick = () => {
    setIsRead(true);
    onRead(alert.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className={`relative p-5 overflow-hidden shadow-lg transition-all duration-10 bg-gray-200 text-gray-800 ${isRead ? 'opacity-60' : ''} ${config.shape}`}
    >
      <div className={`absolute top-0 left-0 h-full w-2 ${config.color}`}></div>
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className={`text-gray-900`}>{config.icon}</span>
            <h3 className="text-xl font-bold">{alert.title}</h3>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {isRead && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <CheckCircle size={16} />
                <span>Read</span>
              </div>
            )}
            
            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full text-gray-900 ${config.color}`}>{alert.severity}</span>
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(alert)}
                    className="p-2 bg-gray-300 rounded-full hover:bg-primary-300"
                  >
                    <Edit size={18} />
                  </motion.button>
                )}
              </div>
            )}
          </div>

        </div>
        <p className="text-gray-600 mb-4">{alert.message}</p>

        {isAdmin && (
          <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
            <span><strong>Visibility:</strong> {alert.visibility}</span>
            <span><strong>Status:</strong> {alert.status}</span>
            <span><strong>Snoozed by:</strong> {alert.snoozeCount || 0} users</span>
          </div>
        )}
        {!isAdmin && (
          <div className="flex items-center gap-3 mt-4">
            {!isRead && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReadClick}
                className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Mark as Read
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSnooze(alert.id)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-900 bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              <BellOff size={16} /> Snooze
            </motion.button>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default AlertCard;