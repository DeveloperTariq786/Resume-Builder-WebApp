import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Eye, Copy, Check, Edit2, MessageSquare, RefreshCw, Sparkles } from 'lucide-react';

const LaTeXEditor = ({ 
  latexCode, 
  editedLatexCode, 
  setEditedLatexCode, 
  isEditing, 
  setIsEditing, 
  setShowLatexCode, 
  copied, 
  handleCopyCode, 
  updatePrompt, 
  setUpdatePrompt, 
  handleUpdateLatex, 
  isGenerating, 
  handleRecompile, 
  showUpdatePrompt, 
  setShowUpdatePrompt,
  activeTab
}) => {
  return (
    <AnimatePresence mode="wait" presenceAffectsLayout={false}>
      {(activeTab === 'code' || window.innerWidth >= 1024) && (
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/50 overflow-hidden flex flex-col"
          layout="position"
          layoutId="latex-editor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.15,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
          style={{
            willChange: 'transform, opacity',
            contain: 'content',
            contentVisibility: 'auto'
          }}
        >
          <div className="border-b border-slate-100 p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100/80 p-1.5 rounded-full">
                  <FileCode className="text-indigo-600 w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  LaTeX Code
                </h3>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#F9FAFB" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLatexCode(false)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-slate-200 hover:shadow-sm text-slate-700"
                >
                  <Eye size={14} />
                  Hide Code
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#F9FAFB" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-slate-200 hover:shadow-sm text-slate-700"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#F9FAFB" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(!isEditing);
                    setShowUpdatePrompt(false);
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-slate-200 hover:shadow-sm text-slate-700"
                >
                  {isEditing ? <Eye size={14} /> : <Edit2 size={14} />}
                  {isEditing ? 'Preview' : 'Edit Code'}
                </motion.button>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-wrap gap-2 mb-3">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#EBF5FF" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowUpdatePrompt(!showUpdatePrompt);
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 border border-blue-200 shadow-sm"
                >
                  <MessageSquare size={14} />
                  {showUpdatePrompt ? 'Hide AI Helper' : 'Ask AI to Edit'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#ECFDF5" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRecompile}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors bg-green-50/80 hover:bg-green-100/80 text-green-700 border border-green-200 shadow-sm disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
                  Recompile
                </motion.button>
              </div>
            )}

            {showUpdatePrompt && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
                transition={{ 
                  duration: 0.15, 
                  ease: [0.25, 0.1, 0.25, 1.0],
                  height: { type: 'spring', stiffness: 180, damping: 20 }
                }}
                style={{ willChange: 'height, opacity' }}
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-blue-100 shadow-sm">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">AI Resume Editor</h4>
                    <p className="text-xs text-blue-700 mb-2">Describe the changes you want to make to your resume, and AI will update the LaTeX code for you.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <textarea
                      value={updatePrompt}
                      onChange={(e) => setUpdatePrompt(e.target.value)}
                      placeholder="E.g., 'Make the name bold', 'Add a skills section', 'Change font color to blue'"
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-white/90 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all resize-vertical"
                      rows={3}
                    />
                    
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(37, 99, 235, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isGenerating && updatePrompt.trim()) {
                          handleUpdateLatex();
                        }
                      }}
                      disabled={isGenerating || !updatePrompt.trim()}
                      className="flex-shrink-0 h-11 w-11 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-md"
                      title="Apply Changes"
                    >
                      {isGenerating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Sparkles size={16} />
                      )}
                    </motion.button>
                  </div>
                  
                  {isGenerating && (
                    <div className="mt-3 bg-white/90 rounded-lg border border-blue-100 p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        <span className="text-xs text-blue-700">Applying your changes...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick suggestions */}
                  <div className="mt-3">
                    <div className="text-xs text-blue-700 mb-2">Quick suggestions:</div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setUpdatePrompt("Make the section titles bold and blue")}
                        className="text-xs bg-blue-50/80 text-blue-700 hover:bg-blue-100/80 rounded-full px-3 py-1 transition-colors border border-blue-200 shadow-sm"
                      >
                        Bold blue titles
                      </button>
                      <button 
                        onClick={() => setUpdatePrompt("Add a professional summary at the top")}
                        className="text-xs bg-blue-50/80 text-blue-700 hover:bg-blue-100/80 rounded-full px-3 py-1 transition-colors border border-blue-200 shadow-sm"
                      >
                        Add summary
                      </button>
                      <button 
                        onClick={() => setUpdatePrompt("Change the layout to two columns")}
                        className="text-xs bg-blue-50/80 text-blue-700 hover:bg-blue-100/80 rounded-full px-3 py-1 transition-colors border border-blue-200 shadow-sm"
                      >
                        Two-column layout
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* LaTeX Code Editor/Preview Container - Full width */}
          <div className="flex-grow relative" style={{ willChange: 'transform', contain: 'content' }}>
            {isEditing ? (
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                key="editor"
                layoutId="latex-content"
              >
                <textarea
                  value={editedLatexCode}
                  onChange={(e) => setEditedLatexCode(e.target.value)}
                  className="w-full h-full px-6 py-5 font-mono text-sm bg-gradient-to-br from-slate-50/90 to-white/90 border-t border-slate-200 focus:outline-none transition-all"
                  spellCheck="false"
                  style={{ minHeight: "450px", resize: "none" }}
                />
                <div className="absolute top-3 right-4 bg-slate-100/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-slate-500 border border-slate-200/50">
                  LaTeX Editor
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="absolute inset-0 overflow-auto bg-gradient-to-br from-slate-50/90 to-white/90 border-t border-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                key="preview"
                layoutId="latex-content"
              >
                <pre className="text-sm font-mono px-6 py-5 text-slate-700 h-full" style={{ minHeight: "450px" }}>{editedLatexCode}</pre>
                <div className="absolute top-3 right-4 bg-slate-100/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-slate-500 border border-slate-200/50">
                  LaTeX Preview
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(LaTeXEditor); 