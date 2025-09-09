import React from 'react';
import Layout from './Layout';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DollarSign, PieChart as PieIcon, TrendingUp, ArrowUpRight } from 'lucide-react';

const holdings = [
  { name: 'Growth Fund', allocation: 45, value: 125000 },
  { name: 'Equity Fund', allocation: 30, value: 83000 },
  { name: 'Bond Fund', allocation: 25, value: 69000 },
];

const history = [
  { month: 'Jan', value: 157000 }, { month: 'Feb', value: 162400 }, { month: 'Mar', value: 168900 },
  { month: 'Apr', value: 166500 }, { month: 'May', value: 174300 }, { month: 'Jun', value: 181100 },
  { month: 'Jul', value: 178800 }, { month: 'Aug', value: 186200 },
];

const Portfolio: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <Layout onNavigate={onNavigate}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* KPIs */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPI icon={<DollarSign className="w-4 h-4" />} title="Portfolio Value" value="GH₵186,200" accent />
          <KPI icon={<TrendingUp className="w-4 h-4" />} title="YTD" value="+6.1%" />
          <KPI icon={<PieIcon className="w-4 h-4" />} title="Holdings" value={`${holdings.length}`} />
        </div>

        {/* Value over time */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Portfolio value</h2>
            <div className="text-xs text-green-600 inline-flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> +1.3% this month</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6200" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#FF6200" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#FF6200" fill="url(#pv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Holdings</h2>
          <div className="space-y-3">
            {holdings.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{h.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">{h.allocation}% allocation</div>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">GH₵{h.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;

function KPI({ icon, title, value, accent }: { icon: React.ReactNode; title: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 shadow flex items-center gap-3 ${accent ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent ? 'bg-white/20' : 'bg-orange-500/10 text-orange-600'}`}>{icon}</div>
      <div>
        <div className={`text-xs ${accent ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>{title}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

