import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, BookOpen, ChevronDown, ChevronUp, LifeBuoy, ExternalLink, Shield } from 'lucide-react';
import Layout from './Layout';

const Help: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const faqs = [
    { q: 'How do I reset my password?', a: 'Go to Settings → Security and use the "Update password" form.' },
    { q: 'How do I deposit funds?', a: 'Open Deposit in the left menu, choose a method, enter amount and continue.' },
    { q: 'Why is my dashboard empty?', a: 'If the database is syncing, you may see sample data. Try again shortly or contact support.' },
  ];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Layout onNavigate={onNavigate}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Help center & FAQs */}
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Help Center</h2>
              <a className="text-sm text-orange-600 hover:underline inline-flex items-center gap-1" href="#"><ExternalLink className="w-4 h-4" /> Browse all articles</a>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Quick links to common topics.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <HelpCard icon={<BookOpen className="w-5 h-5" />} title="Getting started" desc="Basics to set up your account." />
              <HelpCard icon={<LifeBuoy className="w-5 h-5" />} title="Deposits & withdrawals" desc="Payments, methods, timelines." />
              <HelpCard icon={<Shield className="w-5 h-5" />} title="Security" desc="Passwords, 2FA and sessions." />
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Frequently asked questions</h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {faqs.map((f, i) => (
                <button key={i} onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full text-left py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 dark:text-white">{f.q}</div>
                    {openIdx === i ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </div>
                  {openIdx === i && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Contact & ticket */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Contact us</h3>
            <div className="space-y-3 text-sm">
              <Row icon={<MessageSquare className="w-4 h-4" />} title="Live chat" desc="Chat with support 8am–8pm GMT" action="Open chat" />
              <Row icon={<Mail className="w-4 h-4" />} title="Email" desc="support@cmfund.example" action="Compose" />
              <Row icon={<Phone className="w-4 h-4" />} title="Phone" desc="+233 000 000 000" action="Call" />
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Submit a ticket</h3>
            <form className="space-y-3">
              <input className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 outline-none" placeholder="Subject" />
              <select className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 outline-none">
                <option>General inquiry</option>
                <option>Billing</option>
                <option>Technical issue</option>
              </select>
              <textarea className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 outline-none" rows={4} placeholder="Describe your issue" />
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg w-full">Send</button>
              <p className="text-[11px] text-gray-500">Avg. response time: under 2 hours</p>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Help;

function HelpCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
      <div className="w-8 h-8 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center mb-2">{icon}</div>
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  );
}

function Row({ icon, title, desc, action }: { icon: React.ReactNode; title: string; desc: string; action: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">{desc}</div>
        </div>
      </div>
      <button className="text-xs px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-600">{action}</button>
    </div>
  );
}

