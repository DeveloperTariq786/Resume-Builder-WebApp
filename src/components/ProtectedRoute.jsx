import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children, user, showAuthModal }) => {
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this page and start building your resume.</p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => showAuthModal(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-md font-medium shadow-sm hover:shadow transition-all duration-300"
            >
              Log In
            </motion.button>
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                onClick={() => showAuthModal(true)}
                className="text-blue-600 hover:underline font-medium"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;