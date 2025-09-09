import React, { useState } from 'react';
import { Search, Bell, User, Sun, Moon, Menu, X, Home, Wallet, Settings, MessageSquare, LineChart, HelpCircle, LogOut, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentUser?: string;
  onNavigate?: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser = "Adjei Godfred Emmanuel", onNavigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-purple-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'
      } border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-orange-500">CM FUND</h1>
                <p className="text-xs text-gray-500">Investment Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Welcome Message */}
              <div className="text-sm">
                <span className="text-gray-500">Welcome back,</span>
                <span className="font-semibold ml-1">{currentUser.split(' ')[0]}!</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className={`pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                />
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Toggle Sidebar */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarHidden(v => !v)}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={isSidebarHidden ? 'Show navigation' : 'Hide navigation'}
              >
                <Menu className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors duration-300 relative ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
              </motion.button>

              {/* User Profile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden border-t ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'
            }`}
          >
            <div className="px-4 py-4 space-y-4">
              <div className="text-sm">
                <span className="text-gray-500">Welcome back,</span>
                <span className="font-semibold ml-1">{currentUser.split(' ')[0]}!</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button className={`p-2 rounded-lg relative ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                </button>
                <button className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Content Area with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        <div className="flex gap-6">
          {/* Sidebar */}
          {!isSidebarHidden && (
          <aside className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'} hidden md:flex w-56 flex-shrink-0 border rounded-2xl sticky top-24 max-h-[calc(100vh-7rem)]`}> 
            <nav className="p-3 w-full flex flex-col">
              <div className="space-y-1">
                <SidebarItem isDarkMode={isDarkMode} icon={<Home className="w-4 h-4" />} label="Dashboard" active onClick={() => onNavigate?.('dashboard')} />
                <SidebarItem isDarkMode={isDarkMode} icon={<Wallet className="w-4 h-4" />} label="Trade" onClick={() => onNavigate?.('trade')} />
                <SidebarItem isDarkMode={isDarkMode} icon={<Briefcase className="w-4 h-4" />} label="Portfolio" onClick={() => onNavigate?.('portfolio')} />
                <SidebarItem isDarkMode={isDarkMode} icon={<MessageSquare className="w-4 h-4" />} label="Chat" onClick={() => onNavigate?.('chat')} />
                <SidebarItem isDarkMode={isDarkMode} icon={<LineChart className="w-4 h-4" />} label="Insights" onClick={() => onNavigate?.('insights')} />
              </div>
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
                <SidebarItem isDarkMode={isDarkMode} icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" onClick={() => onNavigate?.('help')} />
                <SidebarItem isDarkMode={isDarkMode} icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => onNavigate?.('settings')} />
                <SidebarItem isDarkMode={isDarkMode} icon={<LogOut className="w-4 h-4" />} label="Log Out" onClick={() => onNavigate?.('signin')} />
              </div>
            </nav>
          </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
 
interface SidebarItemProps {
  isDarkMode: boolean;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ isDarkMode, icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 border ${
        isDarkMode
          ? `${active ? 'bg-gray-700 border-gray-600' : 'border-transparent hover:bg-gray-700'} text-gray-200`
          : `${active ? 'bg-gray-100 border-gray-200' : 'border-transparent hover:bg-gray-50'} text-gray-700`
      }`}
    >
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-orange-500/10 text-orange-600">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};