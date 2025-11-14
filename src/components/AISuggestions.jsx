import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AISuggestions = ({ jobTitle = '', userData = {}, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);

  const generateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/generate-profile-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: jobTitle || 'Professional',
          userData: userData,
          suggestionType: 'profile_description'
        }),
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
          toast.success('AI suggestions generated!');
        } else {
          throw new Error('No suggestions received');
        }
      } else {
        throw new Error('Failed to generate suggestions');
      }
    } catch (error) {
      console.error('AI suggestions error:', error);
      
      // Always use fallback suggestions on error
      const fallbackSuggestions = generateFallbackSuggestions();
      setSuggestions(fallbackSuggestions);
      setShowSuggestions(true);
      toast.success('Suggestions ready!');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackSuggestions = () => {
    const baseTitle = (jobTitle && jobTitle.trim() !== '') ? jobTitle : 'Professional';
    
    return [
      `Results-driven ${baseTitle} with proven expertise in delivering high-quality solutions. Passionate about leveraging cutting-edge technologies to drive innovation and exceed performance targets.`,
      
      `Experienced ${baseTitle} with strong analytical and problem-solving abilities. Demonstrated track record of successful project delivery and team collaboration in fast-paced environments.`,
      
      `Detail-oriented ${baseTitle} committed to excellence and continuous improvement. Skilled in stakeholder communication and process optimization with focus on measurable results.`,
      
      `Dynamic ${baseTitle} with entrepreneurial mindset and strong leadership qualities. Proven ability to adapt to new challenges and drive organizational growth through strategic thinking.`,
      
      `Innovative ${baseTitle} passionate about creating impactful solutions that drive business value. Strong communicator with experience in cross-functional collaboration and project management.`
    ];
  };

  const copySuggestion = (suggestion) => {
    navigator.clipboard.writeText(suggestion);
    toast.success('Copied to clipboard!');
  };

  const applySuggestion = (suggestion) => {
    if (onApplySuggestion && typeof onApplySuggestion === 'function') {
      try {
        onApplySuggestion(suggestion);
        toast.success('Suggestion applied!');
      } catch (error) {
        console.error('Error applying suggestion:', error);
        toast.error('Failed to apply suggestion');
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            AI Profile Suggestions
          </h3>
        </div>
        <motion.button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Lightbulb className="w-3 h-3 mr-1" />
              Get Suggestions
            </>
          )}
        </motion.button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        Get AI-powered professional summary suggestions tailored for {jobTitle || 'your role'}
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-3">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 max-h-96 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {suggestion}
                </p>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => applySuggestion(suggestion)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Use This
                  </motion.button>
                  <motion.button
                    onClick={() => copySuggestion(suggestion)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Copy className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!showSuggestions && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Click "Get Suggestions" for AI-powered profile descriptions</p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;