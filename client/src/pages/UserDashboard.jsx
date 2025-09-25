import { useEffect, useState, Fragment } from 'react';
import api from '../services/api';
import AlertCard from '../components/AlertCard';
import { AnimatePresence, motion } from 'framer-motion';
import { BellOff, ChevronDown, Check } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';

const UserDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ severity: '', status: '' });
  const [error, setError] = useState('');

  const severityColors = {
    INFO: 'bg-blue-500',
    WARNING: 'bg-yellow-500',
    CRITICAL: 'bg-red-500',
  }

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'INFO', label: 'Info' },
    { value: 'WARNING', label: 'Warning' },
    { value: 'CRITICAL', label: 'Critical' },
  ];

  useEffect(() => {
    fetchAlerts();
  }, [filters]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const data = await api.getUserAlerts(activeFilters);
      setAlerts(data);
    } catch (err) {
      setError('Failed to fetch alerts.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRead = async (id) => {
    try {
      await api.markAsRead(id);
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === id ? { ...alert, status: 'READ' } : alert
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleSnooze = async (alert) => {
    try {
      const id = alert.alertId;
      await api.snoozeAlert(id);
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.alertId !== id));
    } catch (err) {
      console.error('Failed to snooze alert:', err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Your Active Alerts</h1>
      <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg relative">
        <AnimatePresence>{loading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-20">
          <div className="text-sm font-semibold">
            Filtering...
          </div>
        </motion.div>}
        </AnimatePresence>
        <div className="relative">
          <Listbox value={filters.severity} onChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
            <div className="relative w-48">
              <ListboxButton className="relative w-full cursor-pointer rounded-lg glass py-2 pl-3 pr-10 text-left text-sm">
                <span className="block truncate">{severityOptions.find(o => o.value === filters.severity)?.label || 'All Severities'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown
                    size={20}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md glass py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {severityOptions.map((option) => (
                    <ListboxOption
                      key={`severity-${option.value}`}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? `${severityColors[option.value] || 'bg-teal-600'} text-white` : 'text-gray-900'
                        }`
                      }
                      value={option.value}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                              <Check size={20} aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      {loading && alerts.length === 0 ? (
        <div className="text-center">Loading alerts...</div>
      ) : alerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {alerts.map(alert =>
              <AlertCard
                key={alert.alertId}
                alert={alert}
                onRead={() => handleRead(alert.alertId)}
                onSnooze={() => handleSnooze(alert)} />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
          <BellOff size={64} className="mb-4" />
          <h2 className="text-2xl font-semibold">All Clear!</h2>
          <p>You have no active alerts right now.</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserDashboard;