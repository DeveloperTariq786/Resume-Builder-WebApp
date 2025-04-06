import React from 'react';
import { MessageSquare, FileCode, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileTabs = ({ activeTab, setActiveTab, latexCode }) => {
  return (
    <div className="lg:hidden mb-6">
      <div className="bg-white rounded-xl shadow-md p-1.5 flex">
        <motion.button 
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-3 rounded-lg text-sm font-medium flex justify-center items-center gap-2 transition-all duration-200 
            ${activeTab === 'prompt' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'}`}
          whileHover={{ scale: activeTab !== 'prompt' ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageSquare size={16} className={activeTab === 'prompt' ? 'text-blue-100' : ''} />
          <span>Builder</span>
        </motion.button>
        
        {latexCode && (
          <>
            <motion.button 
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium flex justify-center items-center gap-2 transition-all duration-200
                ${activeTab === 'code' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'}`}
              whileHover={{ scale: activeTab !== 'code' ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileCode size={16} className={activeTab === 'code' ? 'text-indigo-100' : ''} />
              <span>Code</span>
            </motion.button>
            
            <motion.button 
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium flex justify-center items-center gap-2 transition-all duration-200
                ${activeTab === 'preview' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'}`}
              whileHover={{ scale: activeTab !== 'preview' ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText size={16} className={activeTab === 'preview' ? 'text-blue-100' : ''} />
              <span>Preview</span>
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileTabs; 