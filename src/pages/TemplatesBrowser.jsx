import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronRight, AlertCircle, Bookmark, Layout, CheckCircle2, RefreshCw, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

const TemplatesBrowser = ({ onSelectTemplate }) => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
  
    useEffect(() => {
      fetchTemplates();
    }, []);
  
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/get-templates`);
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleTemplateSelect = (template) => {
      onSelectTemplate(template);
      navigate('/generator');
    };
  
    const categories = ['all', ...new Set(Object.values(templates).map(t => t.category))];
    const filteredTemplates = Object.values(templates).filter(template => 
      (selectedCategory === 'all' || template.category === selectedCategory) &&
      (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       template.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          staggerChildren: 0.05,
          delayChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
      }
    };
  
    // Enhanced Empty State Component
    const EmptyState = () => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="rounded-full bg-slate-50 p-6 mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Search className="w-16 h-16 text-slate-300" />
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No matches found</h3>
        <p className="text-slate-500 text-center max-w-md mb-8 text-sm">
          {searchQuery 
            ? `No templates match "${searchQuery}" in ${selectedCategory === 'all' ? 'any category' : `the ${selectedCategory} category`}`
            : 'No templates found in this category'}
        </p>
        <div className="flex gap-4">
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              Clear Search
            </motion.button>
          )}
          {selectedCategory !== 'all' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium"
            >
              Show All Templates
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  
    // Enhanced Loading State
    if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Layout className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-slate-700 font-medium">Loading template gallery</h3>
        <p className="text-slate-500 text-sm mt-2">Please wait while we prepare your resume templates</p>
      </div>
    );
    
    // Enhanced Error State
    if (error) return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 text-lg">Error Loading Templates</h3>
              <p className="text-red-700 mt-1 text-sm">{error}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchTemplates}
            className="w-full mt-3 py-2.5 bg-red-100 text-red-700 rounded-lg font-medium text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> Try Again
          </motion.button>
        </div>
      </div>
    );
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Simplified Header without container background */}
        <div className="sticky top-0 z-50">
          <div className="container mx-auto px-6 py-5 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <Layout className="text-blue-600 w-7 h-7" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Resume Templates
                </h1>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-grow">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for templates..."
                      className="w-full md:w-80 h-12 pl-12 pr-4 py-3 text-base border-2 border-slate-200 rounded-xl bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    {searchQuery && (
                      <button 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setSearchQuery('')}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-12 px-4 py-2 border-2 border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <span className="font-medium">
                      {selectedCategory === 'all' ? 'All Categories' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                      <div className="py-1 max-h-64 overflow-y-auto">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowDropdown(false);
                            }}
                            className={`flex items-center w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                              selectedCategory === category ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
                            }`}
                          >
                            {selectedCategory === category && <CheckCircle2 size={16} className="mr-2 text-blue-600" />}
                            <span className={selectedCategory === category ? 'ml-0' : 'ml-6'}>
                              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          {/* Templates List View */}
          {filteredTemplates.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredTemplates.map(template => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5, 
                    transition: { type: 'spring', stiffness: 300 }
                  }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-200 group h-full flex flex-col"
                >
                  <div className="relative flex-grow">
                    <img
                      src={template.image_url || '/api/placeholder/280/360'}
                      alt={template.name}
                      className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="px-2 py-1 bg-blue-600/90 backdrop-blur-sm text-xs text-white rounded-md font-medium capitalize">
                        {template.category}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPreviewTemplate(template)}
                        className="flex-1 bg-slate-50 text-slate-700 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                      >
                        Preview
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleTemplateSelect(template)}
                        className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-lg flex items-center justify-center"
                      >
                        Use Template
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </div>
  
        {/* Enhanced Preview Modal */}
        <AnimatePresence>
          {previewTemplate && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setPreviewTemplate(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
                  onClick={() => setPreviewTemplate(null)}
                >
                  <X size={20} />
                </button>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/2">
                    <img
                      src={previewTemplate.image_url || '/api/placeholder/600/800'}
                      alt={previewTemplate.name}
                      className="w-full h-auto rounded-lg shadow-md object-cover"
                    />
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3 inline-block capitalize">
                        {previewTemplate.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{previewTemplate.name}</h2>
                    
                    <div className="prose prose-slate prose-sm max-w-none mb-8">
                      <p className="text-slate-600 leading-relaxed">
                        {previewTemplate.description || "This premium resume template is designed to showcase your skills and experience in a professional format. Perfect for job seekers looking to make a strong impression."}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPreviewTemplate(null)}
                        className="flex-1 px-4 py-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 font-medium"
                      >
                        Close Preview
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleTemplateSelect(previewTemplate);
                          setPreviewTemplate(null);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-sm flex items-center justify-center gap-2"
                      >
                        Use This Template <ChevronRight size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
export default TemplatesBrowser;