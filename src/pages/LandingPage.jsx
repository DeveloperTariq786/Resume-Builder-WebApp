import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Settings, Eye } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import Video from '../components/Video';

const LandingPage = ({ onStartCreating, setShowAuth, setIsRegister, user }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleStartCreating = () => {
    if (user) {
      onStartCreating();
    } else {
      setIsRegister(true);
      setShowAuth(true);
    }
  };

  const handleWatchDemo = () => {
    setIsVideoOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 pt-24 pb-32 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-8"
          >
            <div className="bg-blue-100/80 backdrop-blur-sm text-blue-800 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2">
              🎉 Introducing AI-Powered LaTeX Generation
              <span className="bg-blue-200/50 px-2 py-1 rounded-full text-xs">New</span>
            </div>
          </motion.div>
          
          <h1 className="text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
            Create Beautiful <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LaTeX Documents</span><br />
            in Minutes with AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into professionally formatted papers, resumes, and academic documents
            using the power of artificial intelligence and LaTeX.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartCreating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {user ? 'Start Creating Now' : 'Sign Up to Start Creating'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWatchDemo}
              className="bg-white text-gray-800 px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<FileText size={32} className="text-blue-600" />}
            title="Professional Templates"
            description="Access our curated collection of LaTeX templates crafted by academic professionals and industry experts."
          />
          <FeatureCard
            icon={<Settings size={32} className="text-blue-600" />}
            title="AI-Powered Generation"
            description="Let our advanced AI transform your natural language into perfectly formatted LaTeX code instantly."
          />
          <FeatureCard
            icon={<Eye size={32} className="text-blue-600" />}
            title="Real-time Preview"
            description="See your changes come to life instantly with our sophisticated live PDF preview feature."
          />
        </div>
      </div>

      <Video 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
};

export default LandingPage;