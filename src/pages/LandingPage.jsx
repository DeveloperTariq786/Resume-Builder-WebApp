import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Settings, Eye, LineChart, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import Video from '../components/Video';

const LandingPage = ({ showAuthModal, user }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartCreating = () => {
    if (user) {
      navigate('/templates');
    } else {
      showAuthModal(true);
    }
  };

  const handleWatchDemo = () => {
    setIsVideoOpen(true);
  };
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Innovations",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "This resume builder helped me land my dream job. The ATS analysis feature gave me valuable insights to optimize my resume for automated systems."
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Global Media",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "The professional templates and AI-powered suggestions transformed my resume. I received more interview callbacks than ever before."
    },
    {
      name: "Emma Rodriguez",
      role: "UX Designer",
      company: "Creative Solutions",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      text: "The customization options are incredible. I was able to create a unique resume that perfectly showcased my portfolio and experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.5, 1],
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-[60%] left-[15%] w-56 h-56 rounded-full bg-blue-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-6"
          >
            <div className="bg-blue-100/80 backdrop-blur-sm text-blue-800 px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
              Industry-Leading AI Resume Technology
              <span className="bg-blue-200/50 px-2 py-0.5 rounded-full text-xs">Advanced</span>
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Build Your Profestional <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Resume</span><br />
            In <motion.span 
              animate={{ 
                color: ['#2563eb', '#4f46e5', '#7c3aed', '#2563eb'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-black"
            >Seconds</motion.span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Leverage advanced AI to generate tailored, ATS-optimized resumes maximize your interview opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartCreating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {user ? 'Create Your Resume' : 'Get Started Free'}
              <ArrowRight size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleWatchDemo}
              className="bg-white text-gray-800 px-8 py-3.5 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Key Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <FeatureCard
            icon={<FileText size={28} className="text-blue-600" />}
            title="Professional Templates"
            description="Access our collection of premium resume templates designed by industry experts and hiring professionals."
          />
          <FeatureCard
            icon={<Settings size={28} className="text-blue-600" />}
            title="AI-Powered Generation"
            description="Our sophisticated AI transforms your experience and skills into a strategically formatted resume."
          />
          <FeatureCard
            icon={<LineChart size={28} className="text-purple-600" />}
            title="ATS Analysis"
            description="Ensure your resume passes Applicant Tracking Systems with our proprietary optimization technology."
          />
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="bg-white py-20 border-t border-b border-gray-100 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <motion.div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full border-8 border-blue-100"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-20 h-20 rounded-full border-4 border-indigo-100"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <svg className="absolute top-1/2 left-1/4 w-6 h-6 text-blue-200" viewBox="0 0 24 24">
            <motion.path 
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
              fill="currentColor"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
          <svg className="absolute top-1/4 right-1/3 w-5 h-5 text-indigo-200" viewBox="0 0 24 24">
            <motion.path 
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
              fill="currentColor"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Trusted by Industry Professionals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center shadow-sm"
            >
              <h3 className="text-4xl font-bold text-blue-600 mb-2">10k+</h3>
              <p className="text-gray-700 font-medium">Resumes Created</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 text-center shadow-sm"
            >
              <h3 className="text-4xl font-bold text-indigo-600 mb-2">85%</h3>
              <p className="text-gray-700 font-medium">ATS Pass Rate</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 text-center shadow-sm"
            >
              <h3 className="text-4xl font-bold text-purple-600 mb-2">50+</h3>
              <p className="text-gray-700 font-medium">Template Designs</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center shadow-sm"
            >
              <h3 className="text-4xl font-bold text-blue-600 mb-2">78%</h3>
              <p className="text-gray-700 font-medium">Interview Rate</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* ATS Feature Highlight */}
      <div className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 15, 0],
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.svg 
            className="absolute bottom-10 right-[10%] w-8 h-8 text-purple-200" 
            viewBox="0 0 24 24"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <path d="M21 16V8.00002C21 6.34317 19.6569 5.00002 18 5.00002H6C4.34315 5.00002 3 6.34317 3 8.00002V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16Z" 
              stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M3 8L10.7876 13.2792C11.5172 13.7736 12.4828 13.7736 13.2124 13.2792L21 8" 
              stroke="currentColor" strokeWidth="1" fill="none" />
          </motion.svg>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <span className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                  Premium Feature
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight"
              >
                AI-Powered ATS Analysis
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-700 mb-8 leading-relaxed"
              >
                Our proprietary algorithm analyzes your resume against Applicant Tracking Systems criteria, 
                providing strategic recommendations to significantly increase your chances of getting past automated screenings.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-purple-600 mt-1 w-5 h-5 flex-shrink-0" />
                  <p className="text-gray-700">Identify industry-specific keywords for your target role</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-purple-600 mt-1 w-5 h-5 flex-shrink-0" />
                  <p className="text-gray-700">Optimize document structure for maximum ATS compatibility</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-purple-600 mt-1 w-5 h-5 flex-shrink-0" />
                  <p className="text-gray-700">Receive comprehensive performance metrics with actionable improvements</p>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-indigo-100"
              >
                <div className="bg-white rounded-2xl overflow-hidden p-6">
                  <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex items-center gap-2 mb-4">
                    <LineChart size={18} />
                    <span className="font-medium">ATS Analysis Results</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-purple-800 font-medium">Overall Score</span>
                        <span className="text-purple-800 font-bold">85%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2.5">
                        <motion.div 
                          initial={{ width: "0%" }}
                          whileInView={{ width: "85%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="bg-purple-600 h-2.5 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-800 font-medium">Keyword Match</span>
                        <span className="text-blue-800 font-bold">78%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <motion.div 
                          initial={{ width: "0%" }}
                          whileInView={{ width: "78%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                          className="bg-blue-600 h-2.5 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-indigo-800 font-medium">Format Optimization</span>
                        <span className="text-indigo-800 font-bold">92%</span>
                      </div>
                      <div className="w-full bg-indigo-200 rounded-full h-2.5">
                        <motion.div 
                          initial={{ width: "0%" }}
                          whileInView={{ width: "92%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                          className="bg-indigo-600 h-2.5 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm italic">
                    Receive detailed feedback and strategic recommendations to optimize your resume
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-20 bg-white border-t border-gray-100 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <motion.div
            className="absolute top-10 left-[10%] w-4 h-4 bg-yellow-300 rounded-full"
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1]
            }}
          />
          <motion.div
            className="absolute top-40 right-[20%] w-3 h-3 bg-blue-400 rounded-full"
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1],
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-20 left-[25%] w-3 h-3 bg-indigo-400 rounded-full"
            animate={{
              y: [0, -25, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1],
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-40 right-[30%] w-2 h-2 bg-purple-400 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1],
              delay: 1.5
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full border-2 border-blue-100 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">{testimonial.text}</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.2, 
                        delay: 0.5 + (i * 0.1)  
                      }}
                    >
                      <Award size={16} className="text-yellow-500" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <Video 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
};

export default LandingPage;