import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, Fragment } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from "@headlessui/react";

const toLocalDateTimeString = (date) => {
  const pad = (num) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const CreateAlertModal = ({ isOpen, onClose, onSubmit, initialData = null, apiError }) => {
  const severityOptions = [
    { value: "INFO", label: "Info" },
    { value: "WARNING", label: "Warning" },
    { value: "CRITICAL", label: "Critical" },
  ];

  const visibilityOptions = [
    { value: "ORGANIZATION", label: "Entire Organization" },
    { value: "TEAM", label: "Specific Team" },
    { value: "USER", label: "Specific User" },
  ];

  const teamOptions = [
    { value: "1", label: "Engineering" },
    { value: "2", label: "Marketing" },
    { value: "3", label: "Support" },
  ];

  const deliveryOptions = [
    { value: "IN_APP", label: "In-App" },
    { value: "SMS", label: "SMS" },
    { value: "EMAIL", label: "Email" },
  ];

  const severityColors = {
    CRITICAL: "bg-red-500",
    WARNING: "bg-yellow-500",
    INFO: "bg-blue-500",
  };

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    severity: 'INFO',
    startTime: toLocalDateTimeString(new Date()),
    expiryTime: toLocalDateTimeString(new Date(Date.now() + 60 * 60 * 1000)),
    visibility: 'ORGANIZATION',
    targetId: '',
    remindersEnabled: true,
    reminderFrequencyMinutes: 120,
    deliveryType: 'IN_APP',
  });

  useEffect(() => {
    if (initialData) {
      let visibility = 'ORGANIZATION';
      let targetId = '';
      if (initialData.targetTeamId) {
        visibility = 'TEAM';
        targetId = initialData.targetTeamId;
      } else if (initialData.targetUserId) {
        visibility = 'USER';
        targetId = initialData.targetUserId;
      }

      setFormData({
        title: initialData.title || '',
        message: initialData.message || '',
        severity: initialData.severity || 'INFO',
        startTime: initialData.startTime ? initialData.startTime.slice(0, 16) : toLocalDateTimeString(new Date()),
        expiryTime: initialData.expiryTime ? initialData.expiryTime.slice(0, 16) : toLocalDateTimeString(new Date(Date.now() + 60 * 60 * 1000)),
        visibility: visibility,
        targetId: targetId.toString(),
        remindersEnabled: initialData.remindersEnabled !== undefined ? initialData.remindersEnabled : true,
        reminderFrequencyMinutes: initialData.reminderFrequencyMinutes || 120,
        deliveryType: initialData.deliveryType || 'IN_APP',
      });
    } else {
      setFormData({
        title: '',
        message: '',
        severity: 'INFO',
        startTime: toLocalDateTimeString(new Date()),
        expiryTime: toLocalDateTimeString(new Date(Date.now() + 60 * 60 * 1000)),
        visibility: 'ORGANIZATION',
        targetId: '',
        remindersEnabled: true,
        reminderFrequencyMinutes: 120,
        deliveryType: 'IN_APP',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      message: formData.message,
      severity: formData.severity,
      startTime: `${formData.startTime}:00`,
      expiryTime: `${formData.expiryTime}:00`,
      remindersEnabled: formData.remindersEnabled,
      deliveryType: formData.deliveryType,
    };

    if (formData.remindersEnabled) {
      payload.reminderFrequencyMinutes = parseInt(formData.reminderFrequencyMinutes, 10);
    }

    switch (formData.visibility) {
      case 'ORGANIZATION':
        payload.organizationWide = true;
        break;
      case 'TEAM':
        payload.organizationWide = false;
        payload.targetTeamId = parseInt(formData.targetId, 10);
        break;
      case 'USER':
        payload.organizationWide = false;
        payload.targetUserId = parseInt(formData.targetId, 10);
        break;
      default:
        break;
    }

    onSubmit(payload);
  };

  const modalTitle = initialData ? 'Edit Alert' : 'Create New Alert';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-blue-800 transition-colors">
              <X size={24} />
            </motion.button>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{modalTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none h-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <Listbox value={formData.severity} onChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm h-8">
                        <span className="block truncate">{severityOptions.find(o => o.value === formData.severity)?.label}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDown size={20} className="text-gray-400" /></span>
                      </ListboxButton>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md backdrop-blur-2xl py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                          {severityOptions.map((option) => (
                            <ListboxOption key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? `${severityColors[option.value]} text-white` : 'text-gray-900'}`} value={option.value}>
                              {({ selected }) => (<>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                                {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white"><Check size={20} /></span> : null}
                              </>)}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="3" className="w-full px-4 py-2 bg-gray-100 border-2 h-25 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-100 border-2 border-transparent h-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Time</label>
                  <input type="datetime-local" name="expiryTime" value={formData.expiryTime} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-100 border-2 border-transparent h-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
                </div>
              </div>
              <div className="p-6 bg-gray-100/80 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                    <Listbox value={formData.visibility} onChange={(value) => setFormData(prev => ({ ...prev, visibility: value, targetId: '' }))}
                      className='bg-gray-200 border border-gray-300 h-8 rounded-md'>
                      <div className="relative">
                        <ListboxButton className="relative w-full cursor-pointer rounded-lg backdrop-blur-2xl
                         py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm h-8">
                          <span className="block truncate">{visibilityOptions.find(o => o.value === formData.visibility)?.label}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown size={20} className="text-gray-400" />
                          </span>
                        </ListboxButton>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md backdrop-blur-2xl py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                            {visibilityOptions.map((option) => (
                              <ListboxOption key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-50 text-primary-900' : 'text-gray-900'}`} value={option.value}>
                                {({ selected }) => (<>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                                  {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"><Check size={20} /></span> : null}
                                </>)}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                  <div>
                    {formData.visibility === 'TEAM' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Team</label>
                        <Listbox value={formData.targetId} onChange={(value) => setFormData(prev => ({ ...prev, targetId: value }))}
                          className="bg-gray-200 border h-8 border-gray-300 rounded-md">
                          <div className="relative">
                            <ListboxButton className="relative w-full cursor-pointer rounded-lg backdrop-blur-2xl py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm h-8">
                              <span className="block truncate">{teamOptions.find(o => o.value === formData.targetId)?.label || 'Select a team'}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDown size={20} className="text-gray-400" /></span>
                            </ListboxButton>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                              <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md backdrop-blur-2xl py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                                {teamOptions.map((option) => (
                                  <ListboxOption key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-50 text-primary-900' : 'text-gray-900'}`} value={option.value}>
                                    {({ selected }) => (<>
                                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                                      {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"><Check size={20} /></span> : null}
                                    </>)}
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                    )}
                    {formData.visibility === 'USER' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target User ID</label>
                        <input type="number" name="targetId" value={formData.targetId} onChange={handleChange} required placeholder="e.g., 1" className="bg-gray-200 border h-8 border-gray-300 rounded-md w-full px-4 py-2 backdrop-blur-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
                    <Listbox value={formData.deliveryType} onChange={(value) => setFormData(prev => ({ ...prev, deliveryType: value }))}
                      className="bg-gray-200 border h-8 border-gray-300 rounded-md">
                      <div className="relative">
                        <ListboxButton className="relative w-full cursor-pointer rounded-lg backdrop-blur-2xl py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm h-8">
                          <span className="block truncate">{deliveryOptions.find(o => o.value === formData.deliveryType)?.label}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDown size={20} className="text-gray-400" /></span>
                        </ListboxButton>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md backdrop-blur-2xl py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                            {deliveryOptions.map((option) => (
                              <ListboxOption key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-50 text-primary-900' : 'text-gray-900'}`} value={option.value}>
                                {({ selected }) => (<>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                                  {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"><Check size={20} /></span> : null}
                                </>)}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <div className="flex items-center h-5">
                      <input type="checkbox" name="remindersEnabled" checked={formData.remindersEnabled} onChange={handleChange} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                    </div>
                    <label className="text-sm font-medium text-gray-700">Enable Reminders</label>
                  </div>
                </div>

                {formData.remindersEnabled && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Frequency (minutes)</label>
                    <input type="number" name="reminderFrequencyMinutes" value={formData.reminderFrequencyMinutes} onChange={handleChange} required
                      placeholder="e.g., 120" className="w-full px-4 py-2 backdrop-blur-2xl bg-gray-200 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 h-8 focus:border-transparent transition" />
                  </motion.div>
                )}
              </div>

              {apiError && (
                <div className="text-red-600 text-sm p-3 bg-red-100/80 rounded-lg">
                  <strong>Error:</strong> {apiError}
                </div>
              )}
              <div className="flex justify-end gap-4 pt-6">
                <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors hover:bg-gray-300">Cancel</motion.button>
                <motion.button type="submit" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700">{initialData ? 'Update Alert' : 'Create Alert'}</motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateAlertModal;