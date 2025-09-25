import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { BellOff } from 'lucide-react';

const SnoozedAlerts = () => {
  const [snoozedAlerts, setSnoozedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnoozed = async () => {
      try {
        const data = await api.getSnoozedAlerts();
        setSnoozedAlerts(data);
      } catch (error) {
        console.error("Failed to fetch snoozed alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSnoozed();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Snoozed Alerts History</h1>
      {snoozedAlerts.length > 0 ? (
        <div className="space-y-4">
          {snoozedAlerts.map((alert, index) => (
            <motion.div
              key={alert.alertId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-200 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{alert.title}</h3>
                <p className="text-gray-600 text-sm">{alert.message}</p>
              </div>
              <div className="text-yellow-500 flex items-center gap-2">
                <BellOff size={20}/>
                <span>Snoozed</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <BellOff size={64} className="mx-auto mb-4"/>
          <p className="text-xl">You haven't snoozed any alerts yet.</p>
        </div>
      )}
    </motion.div>
  );
};

export default SnoozedAlerts;