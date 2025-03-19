import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LogOut, X, BookOpen } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const ProfileDrawer = ({ isOpen, onClose, user, handleSignOut, setCurrentPage }) => {
  const drawerVariants = {
    closed: { 
      x: '100%',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    open: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }
    }
  };

  const backdropVariants = {
    closed: { 
      opacity: 0,
      transition: { 
        duration: 0.2 
      }
    },
    open: { 
      opacity: 0.3,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl z-50"
          >
            <div className="p-4 h-full">
              <motion.div
                initial="hidden"
                animate="visible"
                className="space-y-6 h-full"
              >
                <motion.div 
                  custom={0} 
                  variants={contentVariants}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      LaTeXify
                    </span>
                    <span className="text-xl font-bold mx-0.5 text-blue-600">.</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent">
                      AI
                    </span>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={contentVariants}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {user?.displayName?.[0] || user?.email?.[0]}
                  </div>
                  <div>
                    <div className="font-medium">{user?.displayName}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </motion.div>
                
                <motion.nav 
                  custom={2} 
                  variants={contentVariants}
                  className="space-y-2"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setCurrentPage('landing');
                      onClose();
                    }}
                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <Home size={20} className="text-blue-600" />
                    <span>Home</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setCurrentPage('templates');
                      onClose();
                    }}
                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <BookOpen size={20} className="text-blue-600" />
                    <span>Templates</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      handleSignOut();
                      onClose();
                    }}
                    className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </motion.button>
                </motion.nav>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header = ({ currentPage, setCurrentPage, user, setShowAuth, setIsRegister }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                L
              </div>
              <div className="flex items-baseline">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
                  LaTeXify
                </h1>
                <span className="text-2xl font-bold mx-0.5 text-blue-600 group-hover:text-indigo-600 transition-colors duration-300">
                  .
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-indigo-600 transition-all duration-300">
                  AI
                </span>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-2 transition-transform duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-shadow duration-300">
                    {user.displayName?.[0] || user.email?.[0]}
                  </div>
                </motion.button>
              ) : (
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsRegister(false);
                      setShowAuth(true);
                    }}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsRegister(true);
                      setShowAuth(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Register
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        handleSignOut={handleSignOut}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default Header;