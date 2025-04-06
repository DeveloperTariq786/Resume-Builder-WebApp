import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, User, LineChart, Download, Check,
  ArrowLeft, PlusCircle
} from 'lucide-react';

const PDFPreviewSection = ({
  pdfBase64,
  isGenerating,
  user,
  handleSaveToProfile,
  isSavingToProfile,
  saveSuccess,
  handleATSAnalysis,
  isAnalyzing,
  setActiveTab
}) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md border border-slate-200/50 overflow-hidden flex flex-col"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                PDF Preview
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(22, 163, 74, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm transition-all shadow-md"
                  onClick={handleSaveToProfile}
                  disabled={!pdfBase64 || isSavingToProfile}
                >
                  {isSavingToProfile ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check size={16} />
                      Saved!
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      Save to Profile
                    </>
                  )}
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(124, 58, 237, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm transition-all shadow-md"
                onClick={handleATSAnalysis}
                disabled={!pdfBase64 || isAnalyzing}
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
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(37, 99, 235, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm transition-all shadow-md"
                onClick={() => {
                  if (pdfBase64) {
                    const link = document.createElement('a');
                    link.href = `data:application/pdf;base64,${pdfBase64}`;
                    link.download = `resume.pdf`;
                    link.click();
                  }
                }}
                disabled={!pdfBase64}
              >
                <Download size={16} />
                Download PDF
              </motion.button>
            </div>
          </div>
          
          <p className="text-slate-500 text-sm mt-2 ml-[52px]">
            Preview your generated resume and export it as a PDF file
          </p>
        </div>
        
        {/* PDF Preview Area */}
        {pdfBase64 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-[560px] rounded-xl border border-slate-200 overflow-hidden shadow-md relative bg-slate-50"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <iframe 
              src={`data:application/pdf;base64,${pdfBase64}`}
              className="w-full h-full relative z-10"
              title="PDF Preview"
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[560px] bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-inner">
            {isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6 mx-auto"></div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Generating your resume</h3>
                <p className="text-slate-500 text-sm">Creating a beautiful, professional PDF just for you</p>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-6"></div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center px-6"
              >
                <div className="rounded-2xl bg-blue-50 p-6 inline-flex mx-auto mb-6">
                  <FileText className="w-14 h-14 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">No PDF preview yet</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">Generate a resume using the resume builder to see your PDF preview here</p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
                    onClick={() => setActiveTab('prompt')}
                  >
                    <ArrowLeft size={16} />
                    Go to Resume Builder
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      {/* Add this to your CSS or as an inline style for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </motion.div>
  );
};

export default PDFPreviewSection; 