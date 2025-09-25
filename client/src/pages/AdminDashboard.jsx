import { useEffect, useState, Fragment } from 'react';
import api from '../services/api';
import AlertCard from '../components/AlertCard';
import CreateAlertModal from '../components/CreateAlertModal';
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, ChevronDown, Check } from "lucide-react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';

const severityOptions = [
  { value: '', label: 'All Severities' },
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'CRITICAL', label: 'Critical' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
];

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ severity: '', status: '' });
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchAdminAlerts();
  }, [filters]);

  const fetchAdminAlerts = async () => {
    setIsLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const data = await api.getAllAlerts(activeFilters);
      setAlerts(data);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenCreateModal = () => {
    setEditingAlert(null);
    setApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (alert) => {
    setEditingAlert(alert);
    setApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAlert(null);
    setApiError(null);
  };

  const severityColors = {
    INFO: 'bg-blue-500',
    WARNING: 'bg-yellow-500',
    CRITICAL: 'bg-red-500',
  }

  const handleFormSubmit = async (formData) => {
    setApiError(null);
    try {
      if (editingAlert) {
        await api.updateAlert(editingAlert.id, formData);
      } else {
        await api.createAlert(formData);
      }
      fetchAdminAlerts();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save alert:", error);
      setApiError(error.message || "An unknown error occurred.");
    }
  };

  return (
    <div>
      <CreateAlertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingAlert}
        apiError={apiError}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Alerts</h1>
          <motion.button
            onClick={handleOpenCreateModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-primary-700"
          >
            <PlusCircle size={20} /> Create Alert
          </motion.button>
        </div>

        <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                    {severityOptions.map((option, optionIdx) => (
                      < ListboxOption
                        key={optionIdx}
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
          </div>

          <div className="relative">
            <Listbox value={filters.status} onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <div className="relative w-48">
                <ListboxButton className="relative w-full cursor-pointer rounded-lg glass py-2 pl-3 pr-10 text-left text-sm">
                  <span className="block truncate">{statusOptions.find(o => o.value === filters.status)?.label || 'All Statuses'}</span>
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
                    {statusOptions.map((option, optionIdx) => (
                      < ListboxOption
                        key={optionIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-teal-600 text-white" : 'text-gray-900'}`
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
          </div>
        </div >

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                isAdmin={true}
                onEdit={() => handleOpenEditModal(alert)}
              />
            ))}
          </AnimatePresence>
        </div>
        {
          !isLoading && alerts.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p>No alerts found. Try adjusting your filters or creating a new alert.</p>
            </div>
          )
        }
      </motion.div >
    </div>
  );
};

export default AdminDashboard;