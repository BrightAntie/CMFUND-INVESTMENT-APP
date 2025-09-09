import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import Layout from './Layout';

// Shared currency formatter for Ghanaian Cedi (GH₵)
const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardData {
  summary: {
    totalInvested: number;
    totalGains: number;
    currentValue: number;
    totalSold: number;
  };
  recentTransactions: Array<{
    tnx_date: string;
    description: string;
    qty_bought: number;
    purchase_price: number;
    amount_invested: number;
    share_balance: number;
    current_value: number;
    gain: number;
    qty_sold: number;
    charges: number;
  }>;
  performance: Array<{
    month: string;
    invested: number;
    gains: number;
    currentValue: number;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // If not logged in or no member ID, fall back to sample data without error
      if (!token || !user.csm_memberID) {
        setDashboardData(null);
        return;
      }

      const response = await fetch(`/api/dashboard/${user.csm_memberID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Backend not ready: use sample data
        setDashboardData(null);
        return;
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (error) {
      // Backend/DB not available: use sample data without showing error UI
      console.warn('Dashboard fetch error, showing sample data:', error);
      setDashboardData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample transaction data based on the requirements (fallback)
  const transactionData = [
    {
      date: '26-JAN-2021',
      description: 'CM FUND Growth Fund',
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
      description: 'CM FUND Equity Fund',
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
      description: 'CM FUND Bond Fund',
      quantityBought: 800,
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
      description: 'CM FUND Growth Fund',
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

  // Summary calculations - use real data if available, fallback to sample data
  const summary = dashboardData?.summary || {
    totalInvested: transactionData.reduce((sum: number, item: any) => sum + item.amountInvested, 0),
    totalGains: transactionData.reduce((sum: number, item: any) => sum + item.gain, 0),
    currentValue: transactionData.reduce((sum: number, item: any) => sum + item.currentValue, 0),
    totalSold: transactionData.filter((item: any) => item.quantitySold > 0).reduce((sum: number, item: any) => sum + (item.quantitySold * item.purchasePrice), 0)
  };

  const transactionDataToUse = dashboardData?.recentTransactions || transactionData;

  // Derived share metrics and YTD gains (fallback calculation)
  const investedShares = transactionDataToUse.reduce((sum: number, t: any) => sum + (t.quantityBought || t.qty_bought || 0), 0);
  const currentShares = transactionDataToUse.reduce((sum: number, t: any) => sum + (t.shareBalance ?? t.share_balance ?? 0), 0);
  const soldShares = transactionDataToUse.reduce((sum: number, t: any) => sum + (t.quantitySold || t.qty_sold || 0), 0);
  const ytdGainsPct = (() => {
    const denom = summary.totalInvested || 0;
    if (denom <= 0) return 0;
    return (summary.totalGains / denom) * 100;
  })();

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


  // Loading state
  if (isLoading) {
    return (
      <Layout onNavigate={onNavigate}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onNavigate={onNavigate}>
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Invested',
              value: formatCurrency(summary.totalInvested),
              change: `Shares: ${investedShares.toLocaleString()}`,
              trend: 'up',
              icon: DollarSign,
              color: 'bg-orange-500'
            },
            {
              title: 'Total Gains',
              value: formatCurrency(summary.totalGains),
              change: `YTD: ${ytdGainsPct >= 0 ? '+' : ''}${ytdGainsPct.toFixed(1)}%`,
              trend: ytdGainsPct >= 0 ? 'up' : 'down',
              icon: TrendingUp,
              color: 'bg-orange-600'
            },
            {
              title: 'Current Value',
              value: formatCurrency(summary.currentValue),
              change: `Shares: ${currentShares.toLocaleString()}`,
              trend: 'up',
              icon: PieChart,
              color: 'bg-orange-500'
            },
            {
              title: 'Total Sold',
              value: formatCurrency(summary.totalSold),
              change: `Shares: ${soldShares.toLocaleString()}`,
              trend: 'up',
              icon: BarChart3,
              color: 'bg-orange-400'
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
                <div className={`text-xs font-medium px-2 py-1 rounded-md ${
                  card.trend === 'up' ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' :
                  card.trend === 'down' ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30' :
                  'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
                }`}>
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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
            </div>
          </motion.div>

          {/* Portfolio Allocation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Portfolio Allocation</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
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

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Performance</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
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
                  formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FF6200" 
                  strokeWidth={3}
                  dot={{ fill: '#FF6200', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#FF6200', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bonds & Crops Feeds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Bonds */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bonds</h3>
            <BondsFeed />
          </div>
          {/* Crops */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Crops</h3>
            <CropsFeed />
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
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
                {transactionDataToUse.map((transaction: any, index: number) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
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

// Simple feeds reading from public JSON endpoints
function BondsFeed() {
  const [items, setItems] = useState<Array<{ name: string; coupon: number; yieldPct: number; price: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/bonds.json');
        if (!res.ok) throw new Error('Failed to load bonds feed');
        const data = await res.json();
        setItems(data.slice(0, 3));
      } catch (e: any) {
        setError('Unable to load bonds feed');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-sm text-gray-500 dark:text-gray-400">Loading bonds…</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-3">
      {items.map((b, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{b.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-300">Coupon {b.coupon}% • Yield {b.yieldPct}%</div>
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(b.price)}</div>
        </div>
      ))}
    </div>
  );
}

function CropsFeed() {
  const [items, setItems] = useState<Array<{ name: string; unit: string; price: number; changePct: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/crops.json');
        if (!res.ok) throw new Error('Failed to load crops feed');
        const data = await res.json();
        setItems(data.slice(0, 3));
      } catch (e: any) {
        setError('Unable to load crops feed');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-sm text-gray-500 dark:text-gray-400">Loading crops…</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-3">
      {items.map((c, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-300">{c.unit}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(c.price)}</div>
            <div className={`text-xs ${c.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>{c.changePct >= 0 ? '+' : ''}{c.changePct}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}