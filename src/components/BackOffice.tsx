import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  UserCheck,
  AlertTriangle,
  Settings,
  BarChart3,
  PieChart,
  Filter,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import Layout from './Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface BackOfficeProps {
  onNavigate: (page: string) => void;
}

const BackOffice: React.FC<BackOfficeProps> = ({ onNavigate }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample administrative data
  const adminStats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Investments',
      value: 'GH₵45.2M',
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Portfolios',
      value: '1,923',
      change: '+8.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: '+0.2%',
      trend: 'up',
      icon: Activity,
      color: 'bg-purple-500'
    }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1200, investments: 15.2 },
    { month: 'Feb', users: 1450, investments: 18.7 },
    { month: 'Mar', users: 1680, investments: 22.1 },
    { month: 'Apr', users: 1920, investments: 28.4 },
    { month: 'May', users: 2150, investments: 32.8 },
    { month: 'Jun', users: 2380, investments: 38.9 },
    { month: 'Jul', users: 2620, investments: 42.3 },
    { month: 'Aug', users: 2847, investments: 45.2 }
  ];

  const fundDistribution = [
    { name: 'Growth Fund', value: 45, amount: 20.34, color: '#FF6200' },
    { name: 'Equity Fund', value: 30, amount: 13.56, color: '#FF8A3D' },
    { name: 'Bond Fund', value: 25, amount: 11.30, color: '#FFB366' }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Kwame Asante',
      email: 'kwame.asante@email.com',
      joinDate: '2024-12-15',
      status: 'Active',
      investment: 25000,
      portfolio: 'Growth Fund'
    },
    {
      id: 2,
      name: 'Ama Osei',
      email: 'ama.osei@email.com',
      joinDate: '2024-12-14',
      status: 'Pending',
      investment: 15000,
      portfolio: 'Equity Fund'
    },
    {
      id: 3,
      name: 'Kofi Mensah',
      email: 'kofi.mensah@email.com',
      joinDate: '2024-12-13',
      status: 'Active',
      investment: 35000,
      portfolio: 'Bond Fund'
    },
    {
      id: 4,
      name: 'Akosua Boateng',
      email: 'akosua.boateng@email.com',
      joinDate: '2024-12-12',
      status: 'Active',
      investment: 18000,
      portfolio: 'Growth Fund'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High transaction volume detected',
      time: '2 minutes ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: 'Daily backup completed successfully',
      time: '1 hour ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'error',
      message: 'Payment gateway timeout',
      time: '3 hours ago',
      severity: 'high'
    }
  ];

  const formatCurrency = (amount: number) => {
    return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <Layout currentUser="Admin User">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Back Office Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage users, investments, and system operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-sm font-medium text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'investments', name: 'Investments', icon: DollarSign },
              { id: 'alerts', name: 'System Alerts', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                  selectedTab === tab.id
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Growth & Investments</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis yAxisId="left" stroke="#6B7280" />
                    <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="users" stroke="#FF6200" strokeWidth={3} dot={{ fill: '#FF6200', strokeWidth: 2, r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="investments" stroke="#FF8A3D" strokeWidth={3} dot={{ fill: '#FF8A3D', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Fund Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Fund Distribution</h3>
                <div className="flex items-center justify-center mb-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={fundDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {fundDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {fundDistribution.map((fund, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: fund.color }}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{fund.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{fund.value}%</span>
                        <p className="text-xs text-gray-500">GH₵{fund.amount}M</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Investment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Portfolio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(user.investment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.portfolio}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'investments' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Investment Overview</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value: number) => [`GH₵${value}M`, 'Investments']}
                  />
                  <Bar dataKey="investments" fill="#FF6200" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedTab === 'alerts' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">System Alerts</h3>
              {systemAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className={`w-5 h-5 mr-3 ${
                        alert.severity === 'high' ? 'text-red-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default BackOffice;