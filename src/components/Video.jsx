import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const Video = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoRef, setVideoRef] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollection = collection(db, 'videos');
        const videoSnapshot = await getDocs(videoCollection);
        const videoList = videoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVideos(videoList);
        if (videoList.length > 0) {
          setSelectedVideo(videoList[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && videos.length === 0) {
      fetchVideos();
    }
  }, [isOpen]);

  const handleVideoLoad = () => {
    setLoading(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef) {
      const progress = (videoRef.currentTime / videoRef.duration) * 100;
      setProgress(progress);
    }
  };

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !videoRef.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef) {
      const progressBar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const progressBarWidth = progressBar.offsetWidth;
      const newTime = (clickPosition / progressBarWidth) * videoRef.duration;
      videoRef.currentTime = newTime;
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black">
          <div className="flex h-screen w-screen items-center justify-center">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Video container */}
              <div className="relative h-full w-full bg-black">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="rounded-lg bg-red-500/10 p-4 backdrop-blur-sm">
                      <p className="text-red-500">Failed to load video. Please try again later.</p>
                    </div>
                  </div>
                )}
                {selectedVideo && (
                  <div className="group relative h-full">
                    <video
                      ref={ref => setVideoRef(ref)}
                      className="h-full w-full cursor-pointer"
                      onLoadedData={handleVideoLoad}
                      onTimeUpdate={handleTimeUpdate}
                      onError={() => setError('Failed to play video')}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={togglePlay}
                      autoPlay
                    >
                      <source src={selectedVideo.url} type="video/mp4" />
                    </video>

                    {/* Video controls overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end opacity-0 transition-opacity group-hover:opacity-100">
                      {/* Title and controls background gradient */}
                      <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                        <h2 className="mb-4 text-2xl font-bold text-white">{selectedVideo.title}</h2>
                        
                        {/* Progress bar */}
                        <div 
                          className="mb-4 h-1 cursor-pointer rounded-full bg-white/20"
                          onClick={handleProgressClick}
                        >
                          <motion.div 
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={togglePlay}
                            className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
                          >
                            {isPlaying ? (
                              <Pause className="h-6 w-6 text-white" />
                            ) : (
                              <Play className="h-6 w-6 text-white" />
                            )}
                          </button>
                          <button
                            onClick={toggleMute}
                            className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
                          >
                            {isMuted ? (
                              <VolumeX className="h-6 w-6 text-white" />
                            ) : (
                              <Volume2 className="h-6 w-6 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video list */}
              {videos.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 max-h-40 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white">More Videos</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {videos.map((video) => (
                      <motion.button
                        key={video.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedVideo(video);
                          setLoading(true);
                          setProgress(0);
                          setIsPlaying(true);
                        }}
                        className={`group relative overflow-hidden rounded-lg transition-all ${
                          selectedVideo?.id === video.id
                            ? 'ring-2 ring-blue-500'
                            : 'hover:ring-2 hover:ring-white/50'
                        }`}
                      >
                        {/* Video thumbnail */}
                        <div className="aspect-video bg-gray-800">
                          {video.thumbnail && (
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        {/* Title overlay */}
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2">
                          <p className="text-sm font-medium text-white line-clamp-2">
                            {video.title}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Video;