import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import api from '../services/api';

const teamOptions = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Support' },
];

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(teamOptions[0]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.register({
        name,
        password,
        teamId: selectedTeam.id,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center maz-h-screen bg-gray-100">
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
        <h2 className="text-3xl font-bold text-center text-gray-900">Create your Account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="password" a className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <Listbox value={selectedTeam} onChange={setSelectedTeam}>
              <div className="relative mt-1">
                <Label className="block text-sm font-medium text-gray-700">Team</Label>
                <ListboxButton className="relative w-full cursor-default rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm h-10 mt-1">
                  <span className="block truncate">{selectedTeam.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md backdrop-blur-2xl py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                    {teamOptions.map((team) => (
                      <ListboxOption
                        key={team.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-primary-900' : 'text-gray-900'
                          }`
                        }
                        value={team}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {team.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                <Check className="h-5 w-5" aria-hidden="true" />
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full px-4 py-2 font-semibold text-white bg-blue-700 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
              Register
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;