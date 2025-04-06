import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, FileUp, HelpCircle, Eye, FileCode,
  AlertCircle, MessageSquare, Check, Upload, Info, X
} from 'lucide-react';

const PromptSection = ({
  prompt,
  setPrompt,
  isGenerating,
  isEnhancing,
  handleEnhancePrompt,
  handleGenerate,
  showUploadSection,
  setShowUploadSection,
  handleFileDrop,
  handleFileUploadClick,
  handleFileSelected,
  isUploading,
  uploadedFileName,
  error,
  setError,
  fileInputRef,
  template,
  showExamplePrompt,
  setShowExamplePrompt,
  showLatexCode,
  setShowLatexCode,
  latexCode
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Show success message when file is uploaded
  useEffect(() => {
    if (uploadedFileName && !isUploading) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // Hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [uploadedFileName, isUploading]);
  
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md border border-slate-200/50 overflow-hidden"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileSelected}
      />
      
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Resume Generator</h2>
          </div>
          <p className="text-slate-500 text-sm ml-[52px]">
            Describe Yourself or upload existing Resume
          </p>
        </div>

        {/* Success/Error Message Area */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"
            >
              <div className="bg-green-100 p-1.5 rounded-full text-green-600 flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-green-800 text-sm">Successfully uploaded</h4>
                <p className="text-green-700 text-xs mt-1">
                  Text has been extracted from {uploadedFileName} and added to the resume prompt.
                </p>
              </div>
              <button 
                onClick={() => setShowSuccessMessage(false)}
                className="flex-shrink-0 text-green-500 hover:text-green-700 rounded-full p-1 hover:bg-green-100 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
            >
              <div className="bg-red-100 p-1.5 rounded-full text-red-600 flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-red-800 text-sm">Error</h4>
                <p className="text-red-700 text-xs mt-1">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 rounded-full p-1 hover:bg-red-100 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <label className="block text-sm font-medium text-slate-700">
                Resume Content
                </label>
              </div>
              <div className="flex gap-2">
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                  onClick={handleFileUploadClick}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hover:shadow-sm"
                >
                  <FileUp size={14} />
                  Upload Resume
                </motion.button>
                
                {latexCode && (
                  <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLatexCode(!showLatexCode)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hover:shadow-sm"
                  >
                    {showLatexCode ? (
                      <>
                        <Eye size={14} />
                        Hide Code
                      </>
                    ) : (
                      <>
                        <FileCode size={14} />
                        Show Code
                      </>
                    )}
                  </motion.button>
                )}
                
                {template.exampleprompt && (
                  <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                    onClick={() => setShowExamplePrompt(!showExamplePrompt)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hover:shadow-sm"
                  >
                    <HelpCircle size={14} />
                  Example
                  </motion.button>
                )}
              </div>
            </div>
            
          {/* PDF Upload Loading Indicator - Show when uploading */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                <div className="border-2 border-dashed border-blue-200 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-blue-200 opacity-30 animate-ping"></div>
                      <div className="relative animate-spin h-12 w-12 border-3 border-blue-500/30 border-t-blue-600 rounded-full"></div>
                    </div>
                    <h4 className="text-blue-800 font-medium text-base mb-1">Processing {uploadedFileName}</h4>
                    <p className="text-blue-600/80 text-sm">Extracting content from your resume...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* PDF Upload Section - Only show when explicitly opened and not uploading */}
          {showUploadSection && !isUploading && !uploadedFileName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                <div 
                className="border-2 border-dashed rounded-xl p-6 border-blue-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/70"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-200 opacity-20 animate-ping"></div>
                    <div className="relative bg-blue-100 p-4 rounded-full mx-auto">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                        </div>
                      </div>
                <p className="text-sm font-medium text-blue-700 mb-2 text-center">
                        Drag & drop your resume PDF here
                      </p>
                <p className="text-xs text-blue-600 mb-4 text-center">
                        or
                      </p>
                <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: "#EBF5FF" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleFileUploadClick}
                        className="px-5 py-2.5 bg-white text-blue-600 border border-blue-300 rounded-lg text-sm font-medium hover:shadow-sm transition-all"
                      >
                        Browse files
                      </motion.button>
                </div>
                </div>
              </motion.div>
            )}
            
          {/* Resume Input Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-48 px-5 py-4 text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none placeholder:text-slate-400 shadow-sm"
                placeholder="Describe your work experience, skills, education, and any other relevant information for your resume..."
              />
              <div className="absolute bottom-3.5 left-4 flex items-center z-10">
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim() || isGenerating}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-transparent shadow-sm transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed tooltip"
                  aria-label="Enhance prompt with AI"
                >
                  {isEnhancing ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Zap size={16} strokeWidth={2.5} />
                  )}
                  <span className="tooltip-text">Enhance your prompt with AI</span>
                </motion.button>
              </div>
              <div className="absolute bottom-3.5 right-4 text-xs text-slate-400">
                {prompt.length} characters
              </div>
            </div>
            
          {/* Generate Button */}
          <div className="mt-4">
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 5px 15px rgba(37, 99, 235, 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || isEnhancing}
              className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Generating Resume...</span>
                  </div>
                ) : (
                  <>
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <Sparkles size={18} />
                      Generate Resume
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </motion.button>
            </div>
          </div>

        {/* Info Tips */}
        <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100/70 overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3 border-b border-blue-100/50">
            <Info size={18} className="text-blue-600" />
            <h4 className="font-medium text-blue-700">Tips for creating your resume</h4>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100/80 p-1.5 rounded-full text-blue-600 mt-0.5 flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800 text-sm">Upload Your Resume</h4>
                <p className="text-blue-700/80 mt-1 text-xs leading-relaxed">
                  Upload an existing resume PDF to extract its content. The system will process the text and use it as input for generating a new, formatted resume.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100/80 p-1.5 rounded-full text-blue-600 mt-0.5 flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800 text-sm">Enhance with AI</h4>
                <p className="text-blue-700/80 mt-1 text-xs leading-relaxed">
                  Use our AI enhancement feature to improve your input. Click the lightning icon in the text area to refine and expand your resume content automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptSection; 