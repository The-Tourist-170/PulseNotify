import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { BarChart, Bar, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid, PieChart as RechartsPieChart } from 'recharts';
import { Bell, Send, CheckCircle } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-gray-50 p-6 rounded-lg shadow-lg flex items-center gap-6"
    >
        <div className={`p-4 rounded-full text-${color}-600`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 font-semibold">{title}</p>
            <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
    </motion.div>
);

const SeverityPieChart = ({ data }) => {
    const COLORS = {
        CRITICAL: '#ef4444', 
        WARNING: '#f59e0b',
        INFO: '#3b82f6',
    };
    const chartData = Object.entries(data).map(([key, value]) => ({ name: key, value }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
};

const SnoozeBarChart = ({ data }) => {
    const sortedData = [...data].sort((a, b) => b.count - a.count);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="alertTitle" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#64afff" name="Snooze Count" />
            </BarChart>
        </ResponsiveContainer>
    );
};


const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAnalytics();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-10">Loading analytics...</div>;
  if (!stats) return <div className="text-center p-10 text-red-500">Could not load analytics data.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">System Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<Bell size={32}/>} title="Total Alerts Created" value={stats.totalAlerts} color="primary"/>
        <StatCard icon={<Send size={32}/>} title="Total Delivered" value={stats.totalDelivered} color="red"/>
        <StatCard icon={<CheckCircle size={32}/>} title="Total Read" value={stats.totalRead} color="green"/>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Severity Breakdown</h2>
          {stats.severityBreakdown && <SeverityPieChart data={stats.severityBreakdown} />}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Snooze Counts Per Alert</h2>
          {stats.snoozeCountsPerAlert && <SnoozeBarChart data={stats.snoozeCountsPerAlert} />}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;