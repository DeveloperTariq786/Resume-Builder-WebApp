import React from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';

/**
 * A button component for analyzing resumes with ATS
 */
const ATSAnalysisButton = ({ onClick, isAnalyzing }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors shadow-sm"
      onClick={onClick}
      disabled={isAnalyzing}
    >
      {isAnalyzing ? (
        <>
          <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
          Analyzing...
        </>
      ) : (
        <>
          <LineChart size={16} />
          ATS Analysis
        </>
      )}
    </motion.button>
  );
};

export default ATSAnalysisButton; 