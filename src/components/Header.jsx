import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  LogOut, 
  X, 
  BookOpen, 
  FileText, 
  User, 
  ChevronRight,
  Menu
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const ProfileDrawer = ({ isOpen, onClose, user, handleSignOut }) => {
  const navigate = useNavigate();
  
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

  const navItems = [
    { icon: <Home size={18} />, title: 'Home', path: '/' },
    { icon: <BookOpen size={18} />, title: 'Templates', path: '/templates' },
    { icon: <User size={18} />, title: 'Profile', path: '/profile' }
  ];

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
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-5 border-b flex justify-between items-center">
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
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* User profile */}
              <div className="p-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{user?.displayName || 'User'}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-blue-600">{item.icon}</div>
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </motion.button>
                  ))}
                </div>
              </nav>
              
              {/* Footer */}
              <div className="p-3 border-t">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(254, 226, 226, 1)' }}
                  onClick={() => {
                    handleSignOut();
                    onClose();
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header = ({ user, showAuthModal }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Templates', path: '/templates' },
    { title: 'Profile', path: '/profile' }
  ];

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow group-hover:shadow-md transition-all duration-300">
                L
              </div>
              <div className="hidden sm:flex items-baseline">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
                  LaTeXify
                </h1>
                <span className="text-xl font-bold mx-0.5 text-blue-600 group-hover:text-indigo-600 transition-colors duration-300">
                  .
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-indigo-600 transition-all duration-300">
                  AI
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
            
            {/* Authentication */}
            <div className="flex items-center gap-2 md:gap-4">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-2"
                  aria-label="Open menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-shadow duration-300">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <Menu className="md:hidden text-gray-500" size={20} />
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => showAuthModal(false)}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-1.5 hidden sm:block"
                  >
                    Log In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => showAuthModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-1.5 rounded-md font-medium shadow hover:shadow-md transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                  <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="md:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    aria-label="Menu"
                  >
                    <Menu size={20} />
                  </button>
                </>
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
      />
    </>
  );
};

export default Header;