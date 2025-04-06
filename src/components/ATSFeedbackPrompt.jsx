import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Sparkles, Check, Zap, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * A simplified and more professional ATS feedback component
 */
const ATSFeedbackPrompt = ({ 
  analysis, 
  onApplySuggestion,
  onClose,
  isApplying = false,
  onApplyAllImprovements
}) => {
  if (!analysis) return null;

  // Format improvements to be more professional
  const professionalImprovements = analysis.improvements.map(improvement => {
    // Ensure improvements start with professional phrases
    if (!improvement.startsWith("Consider") && 
        !improvement.startsWith("Add") && 
        !improvement.startsWith("Include") && 
        !improvement.startsWith("Highlight") &&
        !improvement.startsWith("Enhance")) {
      return `Consider ${improvement.charAt(0).toLowerCase() + improvement.slice(1)}`;
    }
    return improvement;
  });

  const handleApplyAll = () => {
    const fullPrompt = `Improve my resume for ATS compatibility by: 
1. ${professionalImprovements.join('\n2. ')}
3. Adding these keywords: ${analysis.missing_keywords.join(', ')}

Make it professional and focused on highlighting my qualifications.`;
    
    // Call the parent function to handle this
    onApplyAllImprovements(fullPrompt);
  };

  // Calculate score color and message
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Score Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center">
            <Award size={20} className="text-blue-100 mr-2" />
            <h3 className="font-semibold text-white text-base">ATS Compatibility</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-xs text-white">
                {getScoreMessage(analysis.score)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Large Score Display */}
        <div className="flex justify-center my-3 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 flex items-center justify-center border-2 border-white/10">
                <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </span>
              </div>
            </div>
            <svg className="absolute inset-0" width="96" height="96" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="48"
                cy="48"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="289.03"
                strokeDashoffset={289.03 - (289.03 * analysis.score) / 100}
                className={getScoreColor(analysis.score)}
                transform="rotate(-90 48 48)"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[calc(70vh-120px)]">
        {/* Improvement Suggestions - Compact */}
        <div className="mb-4">
          <h4 className="font-medium text-slate-700 flex items-center mb-2 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
            Improvement Suggestions
          </h4>
          
          <div className="space-y-2">
            {professionalImprovements.slice(0, 3).map((improvement, idx) => (
              <div 
                key={idx} 
                className="flex items-start justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-100 hover:shadow-sm transition-all"
              >
                <p className="text-slate-700 text-xs pr-2 leading-relaxed">
                  {improvement}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onApplySuggestion(improvement)}
                  disabled={isApplying}
                  className="flex-shrink-0 text-xs bg-white hover:bg-blue-600 hover:text-white text-blue-600 px-2 py-1 rounded-md border border-blue-200 transition-all shadow-sm"
                >
                  Apply
                </motion.button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Keywords Section - Compact */}
        <div className="mb-4">
          <h4 className="font-medium text-slate-700 flex items-center mb-2 text-sm">
            <Zap className="w-4 h-4 mr-2 text-blue-500" />
            Missing Keywords
          </h4>
          
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
            {analysis.missing_keywords.map((keyword, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onApplySuggestion(`Add the keyword "${keyword}" to my resume in relevant sections`)}
                className="px-2 py-1 bg-white text-blue-700 hover:bg-blue-600 hover:text-white text-xs rounded-md border border-blue-200 transition-all shadow-sm"
              >
                + {keyword}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Strengths Section - Compact */}
        <div className="mb-4">
          <h4 className="font-medium text-slate-700 flex items-center mb-2 text-sm">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            Resume Strengths
          </h4>
          
          <div className="space-y-2">
            {analysis.strengths.slice(0, 3).map((strength, idx) => (
              <div 
                key={idx} 
                className="p-2.5 bg-green-50 rounded-lg border border-green-100"
              >
                <div className="flex items-start">
                  <Check className="w-3.5 h-3.5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">{strength}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Apply All Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyAll}
          disabled={isApplying}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md flex items-center justify-center transition-all duration-300 font-medium"
        >
          {isApplying ? (
            <>
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              Optimizing Resume...
            </>
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Apply All Improvements
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ATSFeedbackPrompt; 