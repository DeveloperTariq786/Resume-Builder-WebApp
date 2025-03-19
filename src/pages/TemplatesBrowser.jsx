import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

const TemplatesBrowser = ({ onSelectTemplate }) => {
    const [templates, setTemplates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [previewTemplate, setPreviewTemplate] = useState(null);
  
    useEffect(() => {
      fetchTemplates();
    }, []);
  
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-templates`);
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        setTemplates(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    const categories = ['all', ...new Set(Object.values(templates).map(t => t.category))];
    const filteredTemplates = Object.values(templates).filter(template => 
      (selectedCategory === 'all' || template.category === selectedCategory) &&
      (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       template.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  
    // Empty State Component
    const EmptyState = () => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="relative w-24 h-24 mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Search className="w-24 h-24 text-gray-200" />
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          {searchQuery 
            ? `No templates match "${searchQuery}" in ${selectedCategory === 'all' ? 'any category' : `the ${selectedCategory} category`}`
            : 'No templates found in this category'}
        </p>
        <div className="flex gap-4">
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Search
            </motion.button>
          )}
          {selectedCategory !== 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
            >
              Show All Templates
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  
    if (loading) return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
    
    if (error) return (
      <div className="text-center py-8">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl inline-block">
          Error: {error}
        </div>
      </div>
    );
  
    return (
      <div className="min-h-screen bg-gray-50/50">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-between">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Template Gallery
              </h1>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full h-9 px-4 py-2 pl-9 text-sm border rounded-lg bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Categories Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 font-medium ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
  
          {/* Templates Grid or Empty State */}
          {filteredTemplates.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredTemplates.map(template => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <img
                    src={template.image_url || '/api/placeholder/280/160'}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{template.category}</p>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPreviewTemplate(template)}
                        className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Preview
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectTemplate(template)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 text-sm rounded-lg"
                      >
                        Select
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
  
        {/* Preview Modal */}
        {previewTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{previewTemplate.name}</h2>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreviewTemplate(null)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectTemplate(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
                  >
                    Use Template
                  </motion.button>
                </div>
              </div>
              <img
                src={previewTemplate.image_url || '/api/placeholder/800/600'}
                alt={previewTemplate.name}
                className="w-full rounded-xl mb-4"
              />
              <p className="text-gray-600 leading-relaxed">{previewTemplate.description}</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  };
  
export default TemplatesBrowser;