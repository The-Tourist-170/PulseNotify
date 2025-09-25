import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRouter';

import Login from '../pages/Login';
import Register from '../pages/Register';
import UserDashboard from '../pages/UserDashboard';
import SnoozedAlerts from '../pages/SnoozedAlerts';
import AdminDashboard from '../pages/AdminDashboard';
import Analytics from '../pages/Analytics';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/snoozed" element={<SnoozedAlerts />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;