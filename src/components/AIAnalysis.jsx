import React, { useState } from 'react';
import { BarChart3, Target, TrendingUp, AlertCircle, CheckCircle, Zap, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AIAnalysis = ({ resumeData, jobTitle }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5001/suggest-improvements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnalysis(data);
        setShowDetails(true);
        toast.success('Resume analysis completed!');
      } else {
        toast.error(data.error || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('AI analysis service is not available');
    }
    setIsAnalyzing(false);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 85) return 'bg-green-100 border-green-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            AI Resume Analysis
          </h3>
        </div>
        <motion.button
          onClick={analyzeResume}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4" />
              <span>Analyze Resume</span>
            </>
          )}
        </motion.button>
      </div>

      {analysis && showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <div className={`p-4 rounded-lg border-2 ${getScoreBackground(analysis.overallScore)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  Overall Resume Score
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on ATS compatibility and professional standards
                </p>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}/100
              </div>
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Content Improvements */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                  Content Improvements
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.contentImprovements?.slice(0, 3).map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-700 dark:text-blue-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Information */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                <h4 className="font-semibold text-orange-800 dark:text-orange-300">
                  Missing Information
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.missingInformation?.slice(0, 3).map((missing, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-700 dark:text-orange-300">{missing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ATS Optimization */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800 dark:text-green-300">
                  ATS Keywords
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.atsOptimization?.slice(0, 6).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact Enhancement */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center mb-3">
                <Zap className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-300">
                  Professional Impact
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.impact?.slice(0, 2).map((impact, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-700 dark:text-purple-300">{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 text-gray-600 mr-2" />
              Recommended Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Immediate:</strong> Fix content and add missing sections
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Enhancement:</strong> Use AI to improve descriptions
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Optimization:</strong> Include suggested keywords naturally
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Final:</strong> Review formatting and structure
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!analysis && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Click "Analyze Resume" to get AI-powered insights</p>
          <p className="text-sm">Get personalized suggestions to improve your resume</p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;