import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Download, Edit2, Play, Eye, AlertCircle, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';
import ExamplePromptStack from '../components/ExamplePromptStack.jsx';

const GeneratorPage = ({ template, onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [latexCode, setLatexCode] = useState('');
    const [editedLatexCode, setEditedLatexCode] = useState('');
    const [pdfBase64, setPdfBase64] = useState('');
    const [error, setError] = useState(null);
    const [compiler, setCompiler] = useState('pdflatex');
    const [stopOnFirstError, setStopOnFirstError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showExamplePrompt, setShowExamplePrompt] = useState(false);
    const [updatePrompt, setUpdatePrompt] = useState('');
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
    const handleUpdateLatex = async () => {
        if (!updatePrompt.trim()) {
            setError('Please provide update instructions');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const updateResponse = await fetch(`${API_BASE_URL}/update-latex`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latex_code: editedLatexCode,
                    update_prompt: updatePrompt
                })
            });

            if (!updateResponse.ok) throw new Error('Failed to update LaTeX');
            
            const { latex_code } = await updateResponse.json();
            setEditedLatexCode(latex_code);
            await compilePDF(latex_code);
            setUpdatePrompt('');
            setShowUpdatePrompt(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };
    const handleGenerate = async () => {
      setIsGenerating(true);
      setError(null);
      
      try {
        const generateResponse = await fetch(`${API_BASE_URL}/generate-latex`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            template_id: template.id,
            options: { compiler, stopOnFirstError }
          })
        });
  
        if (!generateResponse.ok) throw new Error('Failed to generate LaTeX');
        const { latex_code } = await generateResponse.json();
        setLatexCode(latex_code);
        setEditedLatexCode(latex_code);
        await compilePDF(latex_code);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsGenerating(false);
      }
    };
  
    const compilePDF = async (code) => {
      try {
        const compileResponse = await fetch(`${API_BASE_URL}/compile-latex`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            latex_code: code,
            options: { compiler, stopOnFirstError }
          })
        });
  
        if (!compileResponse.ok) throw new Error('Failed to compile PDF');
        const { pdf_base64 } = await compileResponse.json();
        setPdfBase64(pdf_base64);
      } catch (err) {
        setError(err.message);
      }
    };
  
    const handleRecompile = async () => {
      setIsGenerating(true);
      await compilePDF(editedLatexCode);
      setIsGenerating(false);
    };

    const useExamplePrompt = () => {
      if (template.exampleprompt) {
        setPrompt(template.exampleprompt);
        setShowExamplePrompt(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
          >
            <ChevronLeft size={20} />
            Back to Templates
          </motion.button>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100"
          >
            <div className="space-y-6">
              <div className="flex gap-4 flex-wrap">
                <select
                  value={compiler}
                  onChange={(e) => setCompiler(e.target.value)}
                  className="px-4 py-2 border rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="pdflatex">pdfLaTeX</option>
                  <option value="xelatex">XeLaTeX</option>
                  <option value="lualatex">LuaLaTeX</option>
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stopOnFirstError}
                    onChange={(e) => setStopOnFirstError(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Stop on First Error</span>
                </label>
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Describe your document
                  </label>
                  {template.exampleprompt && (
                    <ExamplePromptStack
                      examplePrompt={template.exampleprompt}
                      onUse={useExamplePrompt}
                      showPrompt={showExamplePrompt}
                      onToggle={() => setShowExamplePrompt(!showExamplePrompt)}
                    />
                  )}
                </div>
                
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-40 px-6 py-4 border rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Describe the content you want in your document..."
                />
              </div>
  
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate LaTeX'
                )}
              </motion.button>
            </div>
          </motion.div>
  
          {latexCode && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                LaTeX Code
                            </h3>
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                    onClick={() => navigator.clipboard.writeText(editedLatexCode)}
                                >
                                    <Copy size={16} />
                                    Copy
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                    onClick={() => {
                                        setIsEditing(!isEditing);
                                        setShowUpdatePrompt(false);
                                    }}
                                >
                                    {isEditing ? <Eye size={16} /> : <Edit2 size={16} />}
                                    {isEditing ? 'Preview' : 'Edit'}
                                </motion.button>
                                {isEditing && (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                            onClick={() => setShowUpdatePrompt(!showUpdatePrompt)}
                                        >
                                            <MessageSquare size={16} />
                                            Update
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl disabled:opacity-50"
                                            onClick={handleRecompile}
                                            disabled={isGenerating}
                                        >
                                            <Play size={16} />
                                            Recompile
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {showUpdatePrompt && (
                                <div className="mb-4">
                                    <textarea
                                        value={updatePrompt}
                                        onChange={(e) => setUpdatePrompt(e.target.value)}
                                        placeholder="Describe the changes you want to make in the document "
                                        className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                        rows={3}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleUpdateLatex}
                                            disabled={isGenerating || !updatePrompt.trim()}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    Updating...
                                                </div>
                                            ) : (
                                                <>Apply Changes</>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            )}

                            {isEditing ? (
                                <textarea
                                    value={editedLatexCode}
                                    onChange={(e) => setEditedLatexCode(e.target.value)}
                                    className="w-full h-[600px] font-mono text-sm p-6 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                />
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-xl h-[600px] overflow-auto">
                                    <pre className="text-sm font-mono">{editedLatexCode}</pre>
                                </div>
                            )}
                        </div>
                    </div>
  
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    PDF Preview
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl disabled:opacity-50"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `data:application/pdf;base64,${pdfBase64}`;
                      link.download = `document.pdf`;
                      link.click();
                    }}
                    disabled={!pdfBase64}
                  >
                    <Download size={16} />
                    Download PDF
                  </motion.button>
                </div>
                {pdfBase64 ? (
                  <iframe 
                    src={`data:application/pdf;base64,${pdfBase64}`}
                    className="w-full h-[600px] rounded-xl border border-gray-200"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-500">PDF preview will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
  
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <strong className="font-medium">Error: </strong>
                <span>{error}</span>
              </div>
            </motion.div>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Working with Images</h4>
                <p className="text-blue-700 mt-1">
                  For documents containing images, please copy the generated LaTeX code and paste it into Overleaf. LaTeXify.AI currently doesn't support direct image processing. You can add your images in Overleaf for the complete document compilation.
                </p>
              </div>
            </div>
          </div>
  
        </div>
      </div>
    );
};

export default GeneratorPage;