import React, { useMemo, useState } from 'react';
import Layout from './Layout';
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, Filter, Download, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  fees: number;
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  strategy: string;
}

const sampleTrades: Trade[] = [
  { id: '1', type: 'buy', symbol: 'CMF-GF', name: 'CM FUND Growth Fund', quantity: 1000, price: 15.70, fees: 78.50, total: 15778.50, date: '2024-01-15', status: 'completed', strategy: 'Growth Strategy' },
  { id: '2', type: 'buy', symbol: 'CMF-EF', name: 'CM FUND Equity Fund', quantity: 500, price: 22.40, fees: 56.00, total: 11256.00, date: '2024-01-20', status: 'completed', strategy: 'Value Strategy' },
  { id: '3', type: 'sell', symbol: 'CMF-BF', name: 'CM FUND Bond Fund', quantity: 200, price: 18.25, fees: 18.25, total: 3643.25, date: '2024-02-10', status: 'completed', strategy: 'Income Strategy' },
  { id: '4', type: 'buy', symbol: 'CMF-GF', name: 'CM FUND Growth Fund', quantity: 800, price: 16.20, fees: 64.80, total: 12964.80, date: '2024-02-15', status: 'pending', strategy: 'Growth Strategy' },
  { id: '5', type: 'buy', symbol: 'CMF-IF', name: 'CM FUND Income Fund', quantity: 1200, price: 12.50, fees: 60.00, total: 15060.00, date: '2024-02-20', status: 'failed', strategy: 'Income Strategy' },
];

const Trade: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'execute' | 'strategies'>('history');
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');

  const filteredTrades = useMemo(() => {
    let filtered = sampleTrades;
    if (filter !== 'all') {
      filtered = filtered.filter(t => filter === 'pending' ? t.status === 'pending' : t.type === filter);
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'amount') return b.total - a.total;
      return a.status.localeCompare(b.status);
    });
  }, [filter, sortBy]);

  const totalInvested = sampleTrades.filter(t => t.type === 'buy' && t.status === 'completed').reduce((sum, t) => sum + t.total, 0);
  const totalSold = sampleTrades.filter(t => t.type === 'sell' && t.status === 'completed').reduce((sum, t) => sum + t.total, 0);
  const pendingTrades = sampleTrades.filter(t => t.status === 'pending').length;

  return (
    <Layout onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={<TrendingUp className="w-5 h-5" />} title="Total Invested" value={formatGHS(totalInvested)} color="green" />
          <StatCard icon={<TrendingDown className="w-5 h-5" />} title="Total Sold" value={formatGHS(totalSold)} color="blue" />
          <StatCard icon={<Clock className="w-5 h-5" />} title="Pending Trades" value={pendingTrades.toString()} color="orange" />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { key: 'history', label: 'Trade History', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'execute', label: 'New Trade', icon: <Plus className="w-4 h-4" /> },
                { key: 'strategies', label: 'Strategies', icon: <TrendingUp className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-gray-600 text-orange-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'history' && <TradeHistory trades={filteredTrades} filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />}
          {activeTab === 'execute' && <TradeExecution />}
          {activeTab === 'strategies' && <TradingStrategies />}
        </div>
      </div>
    </Layout>
  );
};

function TradeHistory({ trades, filter, setFilter, sortBy, setSortBy }: { trades: Trade[]; filter: string; setFilter: (f: string) => void; sortBy: string; setSortBy: (s: string) => void }) {
  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 text-sm">
            <option value="all">All Trades</option>
            <option value="buy">Buy Orders</option>
            <option value="sell">Sell Orders</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 text-sm">
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>
        </div>
        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Trades table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fund</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fees</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {trades.map(trade => (
              <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(trade.date).toLocaleDateString()}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trade.type === 'buy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{trade.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{trade.symbol}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trade.quantity.toLocaleString()}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatGHS(trade.price)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatGHS(trade.fees)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatGHS(trade.total)}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={trade.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{trade.strategy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TradeExecution() {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [fund, setFund] = useState('');
  const [amount, setAmount] = useState('');
  const [strategy, setStrategy] = useState('');

  const funds = [
    { id: 'CMF-GF', name: 'CM FUND Growth Fund', price: 16.20 },
    { id: 'CMF-EF', name: 'CM FUND Equity Fund', price: 23.50 },
    { id: 'CMF-BF', name: 'CM FUND Bond Fund', price: 18.75 },
    { id: 'CMF-IF', name: 'CM FUND Income Fund', price: 12.80 },
  ];

  const strategies = ['Growth Strategy', 'Value Strategy', 'Income Strategy', 'Balanced Strategy'];

  return (
    <div className="max-w-2xl">
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Advisory Trading Model</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              SDC Capital manages trades on your behalf based on agreed strategies. Submit your trade request and our team will execute it according to your investment objectives.
            </p>
          </div>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trade Type</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setTradeType('buy')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tradeType === 'buy'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setTradeType('sell')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tradeType === 'sell'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Strategy</label>
            <select value={strategy} onChange={e => setStrategy(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 text-sm">
              <option value="">Select strategy</option>
              {strategies.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fund</label>
          <select value={fund} onChange={e => setFund(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 text-sm">
            <option value="">Select fund</option>
            {funds.map(f => (
              <option key={f.id} value={f.id}>{f.name} - {formatGHS(f.price)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (GH₵)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount to invest"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 text-sm"
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
            Submit Trade Request
          </button>
          <button type="button" className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function TradingStrategies() {
  const strategies = [
    {
      name: 'Growth Strategy',
      description: 'Focus on capital appreciation through equity investments',
      risk: 'High',
      expectedReturn: '12-15%',
      timeHorizon: '3-5 years',
      funds: ['CM FUND Growth Fund', 'CM FUND Equity Fund']
    },
    {
      name: 'Income Strategy',
      description: 'Generate regular income through dividend-paying investments',
      risk: 'Low-Medium',
      expectedReturn: '6-8%',
      timeHorizon: '1-3 years',
      funds: ['CM FUND Bond Fund', 'CM FUND Income Fund']
    },
    {
      name: 'Balanced Strategy',
      description: 'Mix of growth and income for moderate risk-return profile',
      risk: 'Medium',
      expectedReturn: '8-12%',
      timeHorizon: '2-4 years',
      funds: ['CM FUND Growth Fund', 'CM FUND Bond Fund']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy, index) => (
        <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{strategy.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{strategy.description}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Risk Level:</span>
              <span className="font-medium">{strategy.risk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Expected Return:</span>
              <span className="font-medium text-green-600">{strategy.expectedReturn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Time Horizon:</span>
              <span className="font-medium">{strategy.timeHorizon}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recommended Funds:</div>
            <div className="space-y-1">
              {strategy.funds.map((fund, i) => (
                <div key={i} className="text-xs text-gray-600 dark:text-gray-300">• {fund}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} text-white flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{title}</div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: <CheckCircle className="w-3 h-3" /> },
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: <Clock className="w-3 h-3" /> },
    failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: <AlertCircle className="w-3 h-3" /> }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function formatGHS(amount: number) {
  try {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', currencyDisplay: 'narrowSymbol' }).format(amount || 0);
  } catch {
    return `GH₵${(amount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

export default Trade;
