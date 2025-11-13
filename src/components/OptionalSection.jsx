import React, { useState } from 'react';
import { SkipForward, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OptionalSection = ({ 
  sectionName, 
  isRequired = false, 
  onSkip, 
  onContinue,
  children,
  skipReason = '',
  className = ''
}) => {
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  const handleSkip = () => {
    setIsSkipped(true);
    onSkip?.();
    toast.success(`${sectionName} section skipped`);
    setShowSkipConfirm(false);
  };

  const handleUnskip = () => {
    setIsSkipped(false);
    setShowSkipConfirm(false);
  };

  if (isSkipped) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center ${className}`}
      >
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {sectionName} Section Skipped
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {skipReason || `You've chosen to skip the ${sectionName.toLowerCase()} section.`}
        </p>
        <motion.button
          onClick={handleUnskip}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Fill This Section
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Section Header with Skip Option */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {sectionName}
          </h3>
          {!isRequired && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full">
              Optional
            </span>
          )}
          {isRequired && (
            <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs rounded-full">
              Required
            </span>
          )}
        </div>
        
        {!isRequired && (
          <motion.button
            onClick={() => setShowSkipConfirm(true)}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip Section
          </motion.button>
        )}
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-mx-4 shadow-xl"
          >
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Skip {sectionName} Section?
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {getSkipMessage(sectionName.toLowerCase())}
            </p>
            
            <div className="flex gap-3">
              <motion.button
                onClick={handleSkip}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes, Skip
              </motion.button>
              <motion.button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Filling
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Section Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Helper function for skip messages
const getSkipMessage = (sectionName) => {
  const messages = {
    'certificates': 'Certificates can be added later. This won\'t significantly impact your resume if you\'re just starting your career.',
    'projects': 'Projects section is helpful but optional. You can showcase your work experience instead.',
    'experience': 'Work experience is usually important, but if you\'re a fresh graduate, you can focus on education and projects.',
    'skills': 'Skills section is highly recommended for most roles. Consider filling this section.',
    'education': 'Education is important for most resumes. Skipping this might impact your resume strength.',
    'description': 'Professional summary helps recruiters understand your value. Consider adding a brief description.',
  };
  
  return messages[sectionName] || `The ${sectionName} section is optional and can be skipped if not applicable to your situation.`;
};

export default OptionalSection;