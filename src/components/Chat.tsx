import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, PlusCircle, User, Phone, Video, MoreHorizontal, Search } from 'lucide-react';
import Layout from './Layout';

interface ChatProps {
  onNavigate?: (page: string) => void;
}

interface Message {
  id: string;
  sender: 'me' | 'agent';
  text: string;
  timestamp: number;
}

const initialMessages: Message[] = [
  { id: '1', sender: 'agent', text: 'Hello! Welcome to CM FUND support. How can we help today?', timestamp: Date.now() - 1000 * 60 * 60 },
  { id: '2', sender: 'me', text: 'Hi, I want to understand my portfolio performance.', timestamp: Date.now() - 1000 * 60 * 58 },
  { id: '3', sender: 'agent', text: 'Sure! I can walk you through your YTD gains and recent transactions.', timestamp: Date.now() - 1000 * 60 * 56 }
];

const Chat: React.FC<ChatProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg: Message = { id: crypto.randomUUID(), sender: 'me', text: trimmed, timestamp: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    // Mock agent reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'agent', text: 'Thanks! An agent will review and get back shortly.', timestamp: Date.now() }]);
    }, 800);
  };

  const formattedTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Layout onNavigate={onNavigate}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations list */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              placeholder="Search conversations"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[{ name: 'CM FUND Support', last: 'We will get back shortly…' }, { name: 'Portfolio Advisor', last: 'Booked a call for Friday.' },
              { name: 'Elon Musk', last: 'Let’s talk growth and rockets.' },
              
              { name: 'Aliko Dangote', last: 'Manufacturing scale wins.' },
              { name: 'Nana Kwame Bediako', last: 'Opportunities are everywhere.' },
              { name: 'Osei Kwame Despite', last: 'Invest consistently.' }
            ].map((c, i) => (
              <button key={i} className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.last}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col min-h-[60vh]">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">CM FUND Support</div>
                <div className="text-xs text-green-500">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Phone className="w-4 h-4" />
              <Video className="w-4 h-4" />
              <MoreHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  m.sender === 'me'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                }`}>
                  <div>{m.text}</div>
                  <div className={`mt-1 text-[10px] ${m.sender === 'me' ? 'text-orange-100/90' : 'text-gray-500 dark:text-gray-400'}`}>{formattedTime(m.timestamp)}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <PlusCircle className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Smile className="w-5 h-5" />
              </button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message"
                className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm outline-none text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
                <span className="text-sm">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;

