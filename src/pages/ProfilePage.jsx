import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, Trash2, FileText, Download, Eye, AlertTriangle, Briefcase } from 'lucide-react';

const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
    displayName: ''
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    resumeId: null,
    resumeTitle: ''
  });
  // Simplified job section visibility state
  const [showJobSection, setShowJobSection] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const profileResponse = await axios.get(`${API_BASE_URL}/user/${user.uid}`);
        setProfile(profileResponse.data);
        
        // Preserve Google Auth name for both fields if available
        const googleName = user.displayName || '';
        
        setFormData({
          fullName: googleName || profileResponse.data.fullName || '',
          phone: profileResponse.data.phone || '',
          location: profileResponse.data.location || '',
          bio: profileResponse.data.bio || '',
          displayName: googleName || profileResponse.data.displayName || '',
        });

        // Fetch user resumes
        const resumesResponse = await axios.get(`${API_BASE_URL}/user/${user.uid}/resumes`);
        setResumes(resumesResponse.data.resumes || []);
        
        // If user has at least one resume, enable job recommendations section
        if (resumesResponse.data.resumes && resumesResponse.data.resumes.length > 0) {
          setShowJobSection(true);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };
      
      // Keep displayName and fullName in sync with the original Google auth name preserved
      // Only sync the values if they're being edited directly
      const googleDisplayName = user?.displayName;
      
      if (name === 'fullName') {
        // When fullName is changed, update displayName only if it wasn't the Google name
        if (!googleDisplayName || prev.displayName !== googleDisplayName) {
          newFormData.displayName = value;
        }
      } else if (name === 'displayName') {
        // When displayName is changed, update fullName only if it wasn't the Google name
        if (!googleDisplayName || prev.fullName !== googleDisplayName) {
          newFormData.fullName = value;
        }
      }
      
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/user/${user.uid}/profile`, formData);
      setProfile(response.data.user);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!deleteModal.isOpen) {
      // Find the resume title to display in the confirmation dialog
      const resumeToDelete = resumes.find(resume => resume.id === resumeId);
      setDeleteModal({
        isOpen: true,
        resumeId: resumeId,
        resumeTitle: resumeToDelete?.title || 'this resume'
      });
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/resumes/${deleteModal.resumeId}`);
      setResumes(resumes.filter(resume => resume.id !== deleteModal.resumeId));
      setDeleteModal({ isOpen: false, resumeId: null, resumeTitle: '' });
      setLoading(false);
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError('Failed to delete resume. Please try again.');
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, resumeId: null, resumeTitle: '' });
  };

  const handleViewResume = (resume) => {
    if (resume.pdfBase64) {
      // Open PDF in a new tab
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head>
            <title>${resume.title || 'Resume'}</title>
          </head>
          <body style="margin:0;padding:0;">
            <embed width="100%" height="100%" src="data:application/pdf;base64,${resume.pdfBase64}" type="application/pdf" />
          </body>
        </html>
      `);
    }
  };

  const handleDownloadResume = async (resume) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/download-pdf`,
        { pdf_base64: resume.pdfBase64 },
        { responseType: 'blob' }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.title || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading resume:', err);
      setError('Failed to download resume. Please try again.');
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-indigo-600 opacity-90 z-0 overflow-hidden">
              <svg className="absolute bottom-0 left-0 transform translate-x-80 -translate-y-24 opacity-20" width="400" height="400" viewBox="0 0 184 184" xmlns="http://www.w3.org/2000/svg">
                <path d="M182 184a2 2 0 110-4 2 2 0 010 4zm-20-20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm-20 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 40a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 60a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 80a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4z" fill="#fff" fillOpacity="0.8"/>
              </svg>
            </div>

            <div className="relative z-10 px-6 py-10 md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-between">
              {/* Avatar and name section */}
              <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-lg border-4 border-white">
                  {profile?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </div>
                <div className="md:ml-6 mt-4 md:mt-0 text-white">
                  <h1 className="text-3xl font-bold tracking-tight">{profile?.displayName || user?.displayName || user?.email}</h1>
                  <p className="text-indigo-100 mt-1">{profile?.email || user?.email}</p>
                  {profile?.location && (
                    <p className="text-indigo-100 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Edit button */}
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="mt-6 md:mt-0 px-5 py-2.5 bg-white text-indigo-600 rounded-lg shadow-md flex items-center font-medium transition-all hover:bg-indigo-50"
                >
                  <Edit size={18} className="mr-2" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                <AlertTriangle className="mr-3 mt-0.5 flex-shrink-0" size={20} />
                <p>{error}</p>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-all"
                  >
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-semibold text-xl text-gray-900">Personal Information</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">Full Name:</span>
                          <span className="ml-2">{profile?.fullName || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{profile?.email || user?.email}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-all"
                  >
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-semibold text-xl text-gray-900">Contact Details</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-medium">Phone:</span>
                          <span className="ml-2">{profile?.phone || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">Location:</span>
                          <span className="ml-2">{profile?.location || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {profile?.bio && (
                  <motion.div 
                    whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-all"
                  >
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-semibold text-xl text-gray-900">About Me</h3>
                      <div className="mt-4">
                        <div className="flex items-start text-gray-600">
                          <svg className="w-5 h-5 mr-3 mt-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="leading-relaxed">{profile.bio}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal.isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={cancelDelete}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-8 max-w-md w-full z-50"
              >
                <div className="flex items-center justify-center mb-5 text-amber-500">
                  <AlertTriangle size={48} />
                </div>
                
                <h3 className="text-2xl font-bold text-center mb-3">
                  Delete Resume
                </h3>
                
                <p className="text-gray-600 text-center mb-8">
                  Are you sure you want to delete <span className="font-medium">{deleteModal.resumeTitle}</span>? 
                  This action cannot be undone and all resume data will be permanently removed.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={() => handleDeleteResume()}
                    disabled={loading}
                    className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></span>
                        Deleting...
                      </div>
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Saved Resumes */}
        <div className="mb-8 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative bg-indigo-600 p-6 md:p-8">
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <svg className="absolute left-0 top-0 transform -translate-y-12 -translate-x-12 opacity-50" width="400" height="400" viewBox="0 0 184 184" xmlns="http://www.w3.org/2000/svg">
                <path d="M182 184a2 2 0 110-4 2 2 0 010 4zm-20-20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm-20 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 40a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 60a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 80a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4z" fill="#fff" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FileText className="mr-3" size={24} />
                My Resumes
              </h2>
              <p className="text-indigo-100 mt-1">Manage your saved resume templates and documents</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {resumes.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-6">
                  <FileText size={40} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Resumes Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't saved any resumes yet. Create your first resume to get started with your job search.</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/templates')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md inline-flex items-center"
                >
                  <FileText size={18} className="mr-2" />
                  Create Your First Resume
                </motion.button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {resumes.map((resume) => (
                  <motion.div 
                    whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                    key={resume.id} 
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-indigo-200 transition-all"
                  >
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-semibold text-xl text-gray-900">{resume.title}</h3>
                      <div className="flex items-center mt-2 text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(resume.createdAt).toLocaleDateString()}
                        {resume.updatedAt !== resume.createdAt && (
                          <span className="flex items-center ml-4">
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            {new Date(resume.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {resume.description && <p className="text-gray-600 mt-3 line-clamp-2">{resume.description}</p>}
                    </div>
                    <div className="flex justify-end items-center p-4 bg-gray-50">
                      <div className="space-x-2 flex">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewResume(resume)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Resume"
                        >
                          <Eye size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownloadResume(resume)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Download Resume"
                        >
                          <Download size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteResume(resume.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Recommendations Section */}
        {showJobSection && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 p-6 md:p-8">
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <svg className="absolute right-0 top-0 transform translate-y-12 translate-x-12 opacity-50" width="400" height="400" viewBox="0 0 184 184" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="92" cy="92" r="92" fill="#fff" fillOpacity="0.3" />
                  <circle cx="92" cy="92" r="72" stroke="#fff" strokeWidth="2" fill="none" />
                  <circle cx="92" cy="92" r="52" stroke="#fff" strokeWidth="2" fill="none" />
                  <circle cx="92" cy="92" r="32" stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Briefcase className="mr-3" size={24} />
                  Job Recommendations
                </h2>
                <p className="text-teal-100 mt-1">AI-powered job suggestions based on your resume skills</p>
              </div>
            </div>
  
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                  <Briefcase size={48} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h3>
                
                <div className="max-w-md text-center">
                  <p className="text-gray-600 mb-4">
                    We're building an AI-powered job recommendation engine that will match your resume with relevant job opportunities from top job boards.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
                      Personalized Matches
                    </div>
                    <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
                      Skills-Based Recommendations
                    </div>
                    <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
                      Application Tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 