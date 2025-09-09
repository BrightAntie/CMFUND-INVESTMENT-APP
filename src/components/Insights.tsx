import React, { useMemo, useState } from 'react';
import Layout from './Layout';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';

const sample = [
  { month: 'Jan', ytd: 1.2 },
  { month: 'Feb', ytd: 2.6 },
  { month: 'Mar', ytd: 3.1 },
  { month: 'Apr', ytd: 2.2 },
  { month: 'May', ytd: 4.0 },
  { month: 'Jun', ytd: 4.8 },
  { month: 'Jul', ytd: 5.3 },
  { month: 'Aug', ytd: 6.1 }
];

const Insights: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [range, setRange] = useState<'3M'|'6M'|'1Y'>('1Y');
  const filtered = useMemo(() => sample.slice(range === '3M' ? -3 : range === '6M' ? -6 : -8), [range]);

  return (
    <Layout onNavigate={onNavigate}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* KPIs */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPI icon={<TrendingUp className="w-4 h-4" />} title="YTD Gains" value="+6.1%" />
          <KPI icon={<BarChart2 className="w-4 h-4" />} title="Avg. Monthly Return" value="+0.8%" />
          <KPI icon={<PieIcon className="w-4 h-4" />} title="Diversification Score" value="82/100" />
        </div>

        {/* Trend */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Gains trend</h2>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-4 h-4 text-gray-500" />
              {(['3M','6M','1Y'] as const).map(r => (
                <button key={r} onClick={() => setRange(r)} className={`px-2 py-1 rounded ${range===r ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="ytd" stroke="#FF6200" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Monthly breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="ytd" fill="#FF8A3D" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• Best month: Aug (+1.3%)</li>
            <li>• Worst month: Apr (-0.9%)</li>
            <li>• Consistency: 6/8 positive months</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Insights;

function KPI({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow flex items-center gap-3">
      <div className="w-8 h-8 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{title}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

