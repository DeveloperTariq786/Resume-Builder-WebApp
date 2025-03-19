import React from 'react';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children, user, setShowAuth, setIsRegister }) => {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to continue</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowAuth(true);
              setIsRegister(false);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Sign In
          </motion.button>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;