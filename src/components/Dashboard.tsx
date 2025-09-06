import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Eye,
  Target,
  Calendar
} from 'lucide-react';
import Layout from './Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Sample transaction data based on the requirements
  const transactionData = [
    {
      date: '26-JAN-2021',
      description: 'SDC Growth Fund',
      quantityBought: 1000,
      purchasePrice: 15.70,
      amountInvested: 15700.00,
      shareBalance: 1000,
      currentValue: 18500.00,
      gain: 2800.00,
      quantitySold: 0,
      charges: 78.50
    },
    {
      date: '15-MAR-2021',
      description: 'SDC Equity Fund',
      quantityBought: 500,
      purchasePrice: 22.40,
      amountInvested: 11200.00,
      shareBalance: 1500,
      currentValue: 12800.00,
      gain: 1600.00,
      quantitySold: 0,
      charges: 56.00
    },
    {
      date: '10-JUN-2022',
      description: 'SDC Bond Fund',
      quantityBought: 800,
      purchasePrice: 18.25,
      purchasePrice: 18.25,
      amountInvested: 14600.00,
      shareBalance: 2300,
      currentValue: 15800.00,
      gain: 1200.00,
      quantitySold: 0,
      charges: 73.00
    },
    {
      date: '28-AUG-2024',
      description: 'SDC Growth Fund',
      quantityBought: 0,
      purchasePrice: 0,
      amountInvested: 0,
      shareBalance: 1800,
      currentValue: 16200.00,
      gain: -1500.00,
      quantitySold: 200,
      charges: 45.00
    }
  ];

  // Summary calculations
  const totalInvested = transactionData.reduce((sum, item) => sum + item.amountInvested, 0);
  const totalGains = transactionData.reduce((sum, item) => sum + item.gain, 0);
  const currentValue = transactionData.reduce((sum, item) => sum + item.currentValue, 0);
  const totalSold = transactionData.filter(item => item.quantitySold > 0).reduce((sum, item) => sum + (item.quantitySold * item.purchasePrice), 0);

  // Chart data
  const monthlyFlowData = [
    { month: 'Jan', invested: 15700, gains: 2800 },
    { month: 'Feb', invested: 8500, gains: 1200 },
    { month: 'Mar', invested: 11200, gains: 1600 },
    { month: 'Apr', invested: 6800, gains: 900 },
    { month: 'May', invested: 9200, gains: 1400 },
    { month: 'Jun', invested: 14600, gains: 1200 },
    { month: 'Jul', invested: 7300, gains: 800 },
    { month: 'Aug', invested: 5900, gains: 600 }
  ];

  const portfolioData = [
    { name: 'Growth Fund', value: 45, color: '#FF6200' },
    { name: 'Equity Fund', value: 30, color: '#FF8A3D' },
    { name: 'Bond Fund', value: 25, color: '#FFB366' }
  ];

  const performanceData = [
    { month: 'Jan', value: 15700 },
    { month: 'Feb', value: 17200 },
    { month: 'Mar', value: 19800 },
    { month: 'Apr', value: 18900 },
    { month: 'May', value: 21400 },
    { month: 'Jun', value: 23600 },
    { month: 'Jul', value: 22800 },
    { month: 'Aug', value: 25200 }
  ];

  const investmentGoals = [
    { name: 'Emergency Fund', target: 50000, current: 32000, progress: 64 },
    { name: 'Retirement', target: 200000, current: 85000, progress: 42.5 },
    { name: 'House Down Payment', target: 100000, current: 25000, progress: 25 }
  ];

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatCurrency = (amount: number) => {
    return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Invested',
              value: formatCurrency(totalInvested),
              change: '+12.5%',
              trend: 'up',
              icon: DollarSign,
              color: 'bg-blue-500'
            },
            {
              title: 'Total Gains',
              value: formatCurrency(totalGains),
              change: '+8.2%',
              trend: 'up',
              icon: TrendingUp,
              color: 'bg-green-500'
            },
            {
              title: 'Current Value',
              value: formatCurrency(currentValue),
              change: '+15.7%',
              trend: 'up',
              icon: PieChart,
              color: 'bg-orange-500'
            },
            {
              title: 'Total Sold',
              value: formatCurrency(totalSold),
              change: '-2.1%',
              trend: 'down',
              icon: BarChart3,
              color: 'bg-purple-500'
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {card.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Money Flow Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Money Flow</h3>
              <div className="flex space-x-2">
                {['1M', '3M', '6M', '1Y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      selectedTimeframe === period
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyFlowData}>
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
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Bar dataKey="invested" fill="#FF6200" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gains" fill="#FF8A3D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Portfolio Allocation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Portfolio Allocation</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {portfolioData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Investment Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Target className="w-6 h-6 mr-2 text-orange-500" />
              Investment Goals
            </h3>
            <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-6">
            {investmentGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{goal.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                    className="bg-orange-500 h-2 rounded-full"
                  ></motion.div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{goal.progress}% complete</span>
                  <span>{formatCurrency(goal.target - goal.current)} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h3>
              <div className="flex items-center space-x-3">
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
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    'Date',
                    'Description',
                    'Qty Bought',
                    'Purchase Price',
                    'Amount Invested',
                    'Share Balance',
                    'Current Value',
                    'Gain/Loss',
                    'Qty Sold',
                    'Charges'
                  ].map((header) => (
                    <th
                      key={header}
                      onClick={() => handleSort(header.toLowerCase().replace(/\s+/g, ''))}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactionData.map((transaction, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.quantityBought.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.purchasePrice > 0 ? formatCurrency(transaction.purchasePrice) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.amountInvested > 0 ? formatCurrency(transaction.amountInvested) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.shareBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(transaction.currentValue)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.gain >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.gain >= 0 ? '+' : ''}{formatCurrency(transaction.gain)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.quantitySold > 0 ? transaction.quantitySold.toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(transaction.charges)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;