import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import BackOffice from './components/BackOffice';

function App() {
  const [currentPage, setCurrentPage] = useState('signin');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {currentPage === 'signup' && <SignUp onNavigate={handleNavigate} />}
          {currentPage === 'signin' && <SignIn onNavigate={handleNavigate} />}
          {currentPage === 'onboarding' && <Onboarding onNavigate={handleNavigate} />}
          {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentPage === 'backoffice' && <BackOffice onNavigate={handleNavigate} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Helper - Remove in production */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick Navigation:</p>
          <div className="flex flex-col space-y-1">
            {[
              { key: 'signin', label: 'Sign In' },
              { key: 'signup', label: 'Sign Up' },
              { key: 'onboarding', label: 'Onboarding' },
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'backoffice', label: 'Back Office' }
            ].map((page) => (
              <button
                key={page.key}
                onClick={() => handleNavigate(page.key)}
                className={`text-xs px-2 py-1 rounded transition-colors duration-300 ${
                  currentPage === page.key
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;