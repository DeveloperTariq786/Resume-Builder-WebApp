import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, X } from 'lucide-react';

const ErrorMessage = ({ error }) => {
  // Handle the clearError custom event
  useEffect(() => {
    const handleClearError = () => {
      // This event will be caught by parent components
      const event = new CustomEvent('clearGlobalError');
      document.dispatchEvent(event);
    };

    document.addEventListener('clearError', handleClearError);
    return () => {
      document.removeEventListener('clearError', handleClearError);
    };
  }, []);

  if (!error) return null;

  const handleDismissError = () => {
    const event = new CustomEvent('clearGlobalError');
    document.dispatchEvent(event);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-white rounded-xl shadow-lg border border-red-100 py-3 px-5 flex items-center gap-3 max-w-md">
          <div className="flex-shrink-0 text-red-500">
            <XCircle size={20} />
          </div>
          <div className="flex-grow text-red-700 text-sm font-medium">
            {error}
          </div>
          <button 
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-100"
            onClick={handleDismissError}
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorMessage; 