import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';
import ExamplePromptStack from '../components/ExamplePromptStack.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
import ATSAnalysisModal from '../components/ATSAnalysisModal';
import PromptSection from '../components/generator/PromptSection';
import LatexCodeSection from '../components/generator/LatexCodeSection';
import PDFPreviewSection from '../components/generator/PDFPreviewSection';
import MobileTabs from '../components/generator/MobileTabs';
import ErrorMessage from '../components/generator/ErrorMessage';

const GeneratorPage = ({ template, onBack }) => {
    const [user] = useAuthState(auth);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
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
    const [activeTab, setActiveTab] = useState('prompt');
    const [copied, setCopied] = useState(false);
    const [aiMessages, setAiMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const updateInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [isSavingToProfile, setIsSavingToProfile] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showLatexCode, setShowLatexCode] = useState(false);

    // Handle global error clearing
    useEffect(() => {
      const handleClearGlobalError = () => {
        setError(null);
      };
      
      document.addEventListener('clearGlobalError', handleClearGlobalError);
      return () => {
        document.removeEventListener('clearGlobalError', handleClearGlobalError);
      };
    }, []);

    const handleEnhancePrompt = async () => {
      if (!prompt.trim()) {
        setError('Please enter a prompt to enhance');
        return;
      }
      
      setIsEnhancing(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/enhance-prompt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) throw new Error('Failed to enhance prompt');
        
        const { enhanced_prompt } = await response.json();
        setPrompt(enhanced_prompt);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsEnhancing(false);
      }
    };

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
            extracted_text: extractedText,
            template_id: template.id,
            options: { compiler, stopOnFirstError }
          })
        });
  
        if (!generateResponse.ok) throw new Error('Failed to generate LaTeX');
        const { latex_code } = await generateResponse.json();
        setLatexCode(latex_code);
        setEditedLatexCode(latex_code);
        setShowLatexCode(true);
        await compilePDF(latex_code);
        setActiveTab('preview');
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

    const handleCopyCode = async () => {
      try {
        await navigator.clipboard.writeText(editedLatexCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError("Failed to copy to clipboard");
      }
    };

    const handleFileDrop = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    };

    const handleFileUploadClick = () => {
      fileInputRef.current.click();
    };

    const handleFileSelected = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        setShowUploadSection(true);
        handleFileUpload(files[0]);
      }
    };

    const handleFileUpload = async (file) => {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }

      setIsUploading(true);
      setUploadedFileName(file.name);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('resume_file', file);

        const response = await fetch(`${API_BASE_URL}/upload-resume-pdf`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload PDF');
        }

        const data = await response.json();
        setExtractedText(data.extracted_text);
        setPrompt(data.extracted_text);

        const successMessage = {
          type: 'ai',
          content: 'Successfully extracted text from your resume PDF. You can now generate a new formatted resume from this content.',
          suggestions: [
            "Generate resume now",
            "Edit the extracted text",
            "Enhance the extracted text manually"
          ]
        };
        setAiMessages(prevMessages => [...prevMessages, successMessage]);
        
      } catch (err) {
        setError(err.message);
        
        const errorMessage = {
          type: 'ai',
          content: `Error uploading PDF: ${err.message}. Please try a different file or enter your information manually.`,
          suggestions: [
            "Try a different PDF",
            "Enter information manually"
          ]
        };
        setAiMessages(prevMessages => [...prevMessages, errorMessage]);
        
      } finally {
        setIsUploading(false);
      }
    };

    const handleSaveToProfile = async () => {
      if (!user || !pdfBase64) return;
      
      setIsSavingToProfile(true);
      setError(null);
      setSaveSuccess(false);
      
      try {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
        const title = `${template.name} - ${formattedDate}`;
        const displayName = user.displayName || '';
        
        const response = await axios.post(`${API_BASE_URL}/save-resume-pdf`, {
          userId: user.uid,
          email: user.email,
          displayName: displayName,
          photoURL: user.photoURL || '',
          pdf_base64: pdfBase64,
          latex_code: editedLatexCode,
          title: title,
          description: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
          template_id: template.id
        });
        
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (err) {
        console.error('Error saving resume:', err);
        setError(err.message || 'Failed to save resume to your profile');
      } finally {
        setIsSavingToProfile(false);
      }
    };

    const handleATSAnalysis = async () => {
      if (!pdfBase64) return;
      
      setIsAnalyzing(true);
      setIsAnalysisModalOpen(true);
      setAnalysisResult(null);
      setError(null);
      
      try {
        const body = {
          pdf_base64: pdfBase64,
          job_title: '',
          company: ''
        };
        
        console.log("Starting ATS analysis request");
        const response = await axios.post(`${API_BASE_URL}/api/ats-analysis`, body);
        console.log("ATS analysis completed");
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        setAnalysisResult(response.data);
      } catch (error) {
        console.error("Error analyzing resume:", error);
        setError(error.response?.data?.error || error.message || "Failed to analyze resume");
        setTimeout(() => {
          setIsAnalysisModalOpen(false);
        }, 500);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const applyATSSuggestion = async (suggestion) => {
      return new Promise((resolve) => {
        setUpdatePrompt(suggestion);
        setTimeout(() => {
          resolve();
        }, 800);
      });
    };

    const handleApplyAllAndClose = (fullPrompt) => {
      setUpdatePrompt(fullPrompt);
      setIsAnalysisModalOpen(false);
      
      if (activeTab === 'code' || window.innerWidth >= 1024) {
        setIsEditing(true);
        setShowUpdatePrompt(true);
        
        setTimeout(() => {
          if (updateInputRef.current) {
            updateInputRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      } else {
        setActiveTab('code');
        
        setTimeout(() => {
          setIsEditing(true);
          setShowUpdatePrompt(true);
          
          if (updateInputRef.current) {
            updateInputRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    };

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.05, duration: 0.2 }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 relative pb-10">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-200/10 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-200/10 blur-3xl"></div>
          <div className="absolute top-[30%] left-[10%] w-[25%] h-[25%] rounded-full bg-purple-200/10 blur-3xl"></div>
          <div className="hidden lg:block absolute -z-10 inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwMCIgaGVpZ2h0PSIyMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImEiPjxwYXRoIGQ9Ik0wIDEwaDQwdjFIMHoiIGZpbGw9IiNhYmJlZGUxMCIgZmlsbC1vcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0wIDIwaDQwdjFIMHoiIGZpbGw9IiNhYmJlZGUxMCIgZmlsbC1vcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0wIDMwaDQwdjFIMHoiIGZpbGw9IiNhYmJlZGUxMCIgZmlsbC1vcGFjaXR5PSIuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 pt-6 md:pt-10 max-w-[1400px] relative">
          {/* Header area */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-10">
            
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBack}
              className="group flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium py-2 px-4 rounded-lg hover:bg-white/50 hover:shadow-sm transition duration-200"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to Templates</span>
            </motion.button>

            <div className="flex items-center gap-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 rounded-full text-white shadow-md"
              >
                <Sparkles size={16} className="text-blue-200" />
                <span className="font-medium">{template.name || "Custom Template"}</span>
              </motion.div>
              </div>
          </motion.div>

          {/* Mobile Tabs */}
          <MobileTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            latexCode={latexCode}
          />

          {/* Main content area */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            className="grid gap-6 md:gap-8"
            >
            {/* Main section with responsive layout */}
            <div className={`grid grid-cols-1 ${latexCode && showLatexCode ? 'lg:grid-cols-2' : ''} gap-6 md:gap-8`}>
              {/* Prompt Section */}
              <AnimatePresence mode="wait">
                {(activeTab === 'prompt' || window.innerWidth >= 1024) && (
                  <motion.div 
                    variants={itemVariants}
                    layout
                  >
                  <PromptSection
                    prompt={prompt}
                    setPrompt={setPrompt}
                    isGenerating={isGenerating}
                    isEnhancing={isEnhancing}
                    handleEnhancePrompt={handleEnhancePrompt}
                    handleGenerate={handleGenerate}
                    showUploadSection={showUploadSection}
                    setShowUploadSection={setShowUploadSection}
                    handleFileDrop={handleFileDrop}
                    handleFileUploadClick={handleFileUploadClick}
                    handleFileSelected={handleFileSelected}
                    isUploading={isUploading}
                    uploadedFileName={uploadedFileName}
                    error={error}
                      setError={setError}
                    fileInputRef={fileInputRef}
                    template={template}
                    showExamplePrompt={showExamplePrompt}
                    setShowExamplePrompt={setShowExamplePrompt}
                    showLatexCode={showLatexCode}
                    setShowLatexCode={setShowLatexCode}
                    latexCode={latexCode}
                  />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LaTeX Code Section */}
              {latexCode && showLatexCode && (
                <AnimatePresence mode="wait">
                  {(activeTab === 'code' || window.innerWidth >= 1024) && (
                    <motion.div 
                      variants={itemVariants}
                      layout
                    >
                    <LatexCodeSection
                      editedLatexCode={editedLatexCode}
                      setEditedLatexCode={setEditedLatexCode}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      showUpdatePrompt={showUpdatePrompt}
                      setShowUpdatePrompt={setShowUpdatePrompt}
                      updatePrompt={updatePrompt}
                      setUpdatePrompt={setUpdatePrompt}
                      handleUpdateLatex={handleUpdateLatex}
                      handleRecompile={handleRecompile}
                      handleCopyCode={handleCopyCode}
                      isGenerating={isGenerating}
                      copied={copied}
                      setShowLatexCode={setShowLatexCode}
                    />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* PDF Preview Section */}
            {latexCode && (
              <AnimatePresence mode="wait">
                {(activeTab === 'preview' || window.innerWidth >= 1024) && (
                  <motion.div 
                    variants={itemVariants}
                    layout
                  >
                  <PDFPreviewSection
                    pdfBase64={pdfBase64}
                    isGenerating={isGenerating}
                    user={user}
                    handleSaveToProfile={handleSaveToProfile}
                    isSavingToProfile={isSavingToProfile}
                    saveSuccess={saveSuccess}
                    handleATSAnalysis={handleATSAnalysis}
                    isAnalyzing={isAnalyzing}
                    setActiveTab={setActiveTab}
                  />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Error Message */}
          <ErrorMessage error={error} />
        </div>

        {/* Example Prompt Stack Component */}
        {template.exampleprompt && (
          <ExamplePromptStack
            examplePrompt={template.exampleprompt}
            onUse={useExamplePrompt}
            showPrompt={showExamplePrompt}
            onToggle={() => setShowExamplePrompt(!showExamplePrompt)}
          />
        )}

        <ATSAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          analysis={analysisResult}
          isAnalyzing={isAnalyzing}
          onApplySuggestion={applyATSSuggestion}
          onApplyAllAndClose={handleApplyAllAndClose}
        />
      </div>
    );
};

export default GeneratorPage;