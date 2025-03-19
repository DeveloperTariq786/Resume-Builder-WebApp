import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-100"
  >
    <div className="bg-blue-50 p-4 rounded-2xl">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mt-6 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

export default FeatureCard;