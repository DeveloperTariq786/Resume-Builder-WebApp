import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, X, Loader } from 'lucide-react';
import ATSFeedbackPrompt from './ATSFeedbackPrompt';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c2c2c2;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
`;

const ATSAnalysisModal = ({ 
  isOpen, 
  onClose, 
  analysis, 
  isAnalyzing, 
  onApplySuggestion,
  onApplyAllAndClose 
}) => {
  const modalRef = useRef(null);
  const [isApplying, setIsApplying] = useState(false);

  // Keep only the escape key handler for accessibility
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleApplySuggestion = async (suggestion) => {
    setIsApplying(true);
    try {
      await onApplySuggestion(suggestion);
    } finally {
      setIsApplying(false);
    }
  };

  // Handle applying all improvements and closing modal
  const handleApplyAllImprovements = (fullPrompt) => {
    setIsApplying(true);
    try {
      // Pass the comprehensive improvement prompt to parent component
      onApplyAllAndClose(fullPrompt);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="w-full max-w-md max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            ref={modalRef}
            onClick={e => e.stopPropagation()}
          >
            {isAnalyzing ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="relative mb-5">
                  <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <Loader className="absolute inset-0 w-14 h-14 text-blue-600 animate-pulse opacity-30" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Analyzing Your Resume</h3>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 max-w-sm">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Our AI is analyzing how well your resume performs with Applicant Tracking Systems.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
                    <div className="bg-white px-2 py-0.5 rounded-full text-xs text-blue-700 border border-blue-100">Keywords</div>
                    <div className="bg-white px-2 py-0.5 rounded-full text-xs text-blue-700 border border-blue-100">Format</div>
                    <div className="bg-white px-2 py-0.5 rounded-full text-xs text-blue-700 border border-blue-100">Score</div>
                  </div>
                </div>
              </div>
            ) : analysis ? (
              <ATSFeedbackPrompt 
                analysis={analysis}
                onApplySuggestion={handleApplySuggestion}
                onClose={onClose}
                isApplying={isApplying}
                onApplyAllImprovements={handleApplyAllImprovements}
              />
            ) : (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                  <X size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Analysis Error</h3>
                <p className="text-slate-600 text-sm max-w-md mb-5">
                  We couldn't complete the ATS analysis at this time. Please try again in a few moments.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
                >
                  Close
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ATSAnalysisModal; 