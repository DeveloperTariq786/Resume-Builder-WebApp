import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileCode, Eye, Copy, Edit2, MessageSquare, 
  RefreshCw, Sparkles, Check, Code
} from 'lucide-react';

const LatexCodeSection = ({
  editedLatexCode,
  setEditedLatexCode,
  isEditing,
  setIsEditing,
  showUpdatePrompt,
  setShowUpdatePrompt,
  updatePrompt,
  setUpdatePrompt,
  handleUpdateLatex,
  handleRecompile,
  handleCopyCode,
  isGenerating,
  copied,
  setShowLatexCode
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
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                LaTeX Editor
              </h3>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLatexCode(false)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-slate-200 hover:shadow-sm text-slate-700"
              >
                <Eye size={14} />
                Hide Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-slate-200 hover:shadow-sm text-slate-700"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB" }}
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
          
          <p className="text-slate-500 text-sm mt-2 ml-[52px]">
            Edit the LaTeX code directly or use AI to make changes
          </p>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-wrap gap-2 mb-5">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#EBF5FF" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowUpdatePrompt(!showUpdatePrompt);
              }}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
            >
              <MessageSquare size={16} />
              {showUpdatePrompt ? 'Hide AI Helper' : 'Ask AI to Edit'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#ECFDF5" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRecompile}
              disabled={isGenerating}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
              Recompile
            </motion.button>
          </div>
        )}

        {/* AI Prompt Input */}
        {showUpdatePrompt && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-medium text-blue-800">AI Resume Editor</h4>
                </div>
                <p className="text-xs text-blue-700 mb-3">Describe the changes you want to make to your resume, and AI will update the LaTeX code for you.</p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-grow">
                  <textarea
                    value={updatePrompt}
                    onChange={(e) => setUpdatePrompt(e.target.value)}
                    placeholder="E.g., 'Make the name bold', 'Add a skills section', 'Change font color to blue'"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-vertical"
                    rows={3}
                  />
                </div>
                
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
                  className="flex-shrink-0 h-[52px] w-[52px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-md"
                  title="Apply Changes"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Sparkles size={20} />
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
              <div className="mt-4">
                <div className="text-xs text-blue-700 mb-2">Quick suggestions:</div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setUpdatePrompt("Make the section titles bold and blue")}
                    className="text-xs bg-white text-blue-700 hover:bg-blue-50 rounded-full px-3 py-1.5 transition-colors border border-blue-200 shadow-sm"
                  >
                    Bold blue titles
                  </button>
                  <button 
                    onClick={() => setUpdatePrompt("Add a professional summary at the top")}
                    className="text-xs bg-white text-blue-700 hover:bg-blue-50 rounded-full px-3 py-1.5 transition-colors border border-blue-200 shadow-sm"
                  >
                    Add summary
                  </button>
                  <button 
                    onClick={() => setUpdatePrompt("Change the layout to two columns")}
                    className="text-xs bg-white text-blue-700 hover:bg-blue-50 rounded-full px-3 py-1.5 transition-colors border border-blue-200 shadow-sm"
                  >
                    Two-column layout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* LaTeX Code Editor/Preview */}
        <div className="flex-grow rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="relative h-full">
              <textarea
                value={editedLatexCode}
                onChange={(e) => setEditedLatexCode(e.target.value)}
                className="w-full h-full px-6 py-5 font-mono text-sm focus:outline-none transition-all"
                spellCheck="false"
                style={{ minHeight: "450px", resize: "none" }}
              />
              <div className="absolute top-3 right-4 bg-slate-100 px-2 py-1 rounded text-xs text-slate-500 border border-slate-200/50">
                LaTeX Editor
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="px-6 py-5 font-mono text-sm text-slate-800 overflow-auto" style={{ maxHeight: "450px" }}>
                <code>{editedLatexCode}</code>
              </pre>
              <div className="absolute top-3 right-4 bg-slate-100 px-2 py-1 rounded text-xs text-slate-500 border border-slate-200/50">
                Read-only
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LatexCodeSection; 