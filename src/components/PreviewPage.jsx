import React, { useState } from 'react';
import { ArrowLeft, Brain, Download, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {T1} from './T1.jsx';
import {T2} from './T2.jsx';
import {T3} from './T3.jsx';
import {T4} from './T4.jsx';
import {T5} from './T5.jsx';
import {T6} from './T6.jsx';

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeData, originalData } = location.state || {};
  
  const [aiEnhancedData, setAiEnhancedData] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('original'); // 'original' or 'enhanced'

  // If no data, redirect back
  if (!resumeData) {
    navigate('/');
    return null;
  }

  const enhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch('http://localhost:5001/complete-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData,
          action: 'complete_and_enhance'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const cleanedData = cleanupMarkdownInNonTargetSections(data.enhancedResume);
        setAiEnhancedData(cleanedData);
        setSelectedVersion('enhanced');
        toast.success('Resume enhanced with AI!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
      
      // Fallback enhancement
      const fallbackEnhanced = createFallbackEnhancement(resumeData);
      setAiEnhancedData(fallbackEnhanced);
      setSelectedVersion('enhanced');
      toast.success('Resume enhanced with built-in improvements!');
    }
    setIsEnhancing(false);
  };

  const cleanupMarkdownInNonTargetSections = (data) => {
    // Remove markdown (**text**) from sections where we don't parse it
    const cleaned = JSON.parse(JSON.stringify(data));
    
    // Clean description/profile summary - no markdown
    if (cleaned.Description?.UserDescription) {
      cleaned.Description.UserDescription = cleaned.Description.UserDescription.replace(/\*\*/g, '');
    }
    
    // Clean skills - no markdown
    if (cleaned.skills?.hardSkills) {
      cleaned.skills.hardSkills = cleaned.skills.hardSkills.replace(/\*\*/g, '');
    }
    if (cleaned.skills?.softSkills) {
      cleaned.skills.softSkills = cleaned.skills.softSkills.replace(/\*\*/g, '');
    }
    
    // Clean contact info - no markdown
    if (cleaned.contactInfo) {
      Object.keys(cleaned.contactInfo).forEach(key => {
        if (typeof cleaned.contactInfo[key] === 'string') {
          cleaned.contactInfo[key] = cleaned.contactInfo[key].replace(/\*\*/g, '');
        }
      });
    }
    
    // Clean education - no markdown
    if (cleaned.education && Array.isArray(cleaned.education)) {
      cleaned.education.forEach(edu => {
        Object.keys(edu).forEach(key => {
          if (typeof edu[key] === 'string') {
            edu[key] = edu[key].replace(/\*\*/g, '');
          }
        });
      });
    }
    
    // Keep markdown in: projects (toolsTechUsed), workExperience (keyAchievements)
    // These sections will parse the markdown to bold text
    
    return cleaned;
  };

  const createFallbackEnhancement = (data) => {
    const enhanced = JSON.parse(JSON.stringify(data));

    // Enhance contact info
    if (!enhanced.contactInfo.jobTitle || enhanced.contactInfo.jobTitle.length < 10) {
      enhanced.contactInfo.jobTitle = enhanced.contactInfo.jobTitle || 'Professional';
    }

    // Enhance skills - NO MARKDOWN FORMATTING
    if (!enhanced.skills.hardSkills || enhanced.skills.hardSkills.length < 20) {
      const jobTitle = enhanced.contactInfo.jobTitle.toLowerCase();
      const additionalSkills = getSkillSuggestions(jobTitle);
      enhanced.skills.hardSkills = enhanced.skills.hardSkills 
        ? `${enhanced.skills.hardSkills}, ${additionalSkills}`
        : additionalSkills;
    }

    if (!enhanced.skills.softSkills || enhanced.skills.softSkills.length < 20) {
      enhanced.skills.softSkills = enhanced.skills.softSkills 
        ? `${enhanced.skills.softSkills}, Communication, Problem Solving, Leadership, Teamwork, Time Management`
        : 'Communication, Problem Solving, Leadership, Teamwork, Time Management, Adaptability';
    }

    // Clean up any markdown from skills
    if (enhanced.skills.hardSkills) {
      enhanced.skills.hardSkills = enhanced.skills.hardSkills.replace(/\*\*/g, '');
    }
    if (enhanced.skills.softSkills) {
      enhanced.skills.softSkills = enhanced.skills.softSkills.replace(/\*\*/g, '');
    }

    // Enhance description - NO MARKDOWN
    if (!enhanced.Description?.UserDescription || enhanced.Description.UserDescription.length < 50) {
      enhanced.Description = enhanced.Description || {};
      enhanced.Description.UserDescription = `Experienced ${enhanced.contactInfo.jobTitle} with proven track record in delivering high-quality results. Strong expertise in problem-solving and team collaboration.`;
    }

    // Clean up any markdown from description
    if (enhanced.Description?.UserDescription) {
      enhanced.Description.UserDescription = enhanced.Description.UserDescription.replace(/\*\*/g, '');
    }

    // Enhance work experience with role descriptions
    if (enhanced.workExperience && Array.isArray(enhanced.workExperience)) {
      enhanced.workExperience = enhanced.workExperience.map(exp => {
        if (!exp.keyAchievements || exp.keyAchievements.length < 100) {
          return {
            ...exp,
            keyAchievements: `Responsible for delivering high-quality results and contributing to team success. **Implemented** solutions that improved efficiency and **collaborated** with cross-functional teams to **achieve** measurable results and exceed goals.`
          };
        }
        return exp;
      });
    }

    return enhanced;
  };

  const getSkillSuggestions = (jobTitle) => {
    const skillMap = {
      'developer': 'JavaScript, Python, React, Node.js, Git, SQL',
      'designer': 'Figma, Adobe Creative Suite, Sketch, Prototyping, UI/UX',
      'manager': 'Project Management, Agile, Scrum, Leadership, Analytics',
      'analyst': 'Excel, SQL, Python, Data Visualization, Statistics',
      'marketing': 'Digital Marketing, SEO, Social Media, Analytics, Content Creation',
      'sales': 'CRM, Lead Generation, Negotiation, Customer Relations, Sales Analytics'
    };

    for (const [key, skills] of Object.entries(skillMap)) {
      if (jobTitle.includes(key)) {
        return skills;
      }
    }
    return 'Microsoft Office, Communication, Problem Solving, Time Management';
  };

  const getTemplateComponent = () => {
    const templateIndex = resumeData.selectedTemplate;
    const templateComponents = { T1, T2, T3, T4, T5, T6 };
    return templateComponents[`T${templateIndex}`] || T1;
  };

  const getCurrentData = () => {
    return selectedVersion === 'enhanced' && aiEnhancedData ? aiEnhancedData : resumeData;
  };

  const renderTemplate = () => {
    try {
      const TemplateComponent = getTemplateComponent();
      const currentData = getCurrentData();
      
      // Validate essential data exists
      if (!currentData || Object.keys(currentData).length === 0) {
        return (
          <div className="p-8 text-center text-gray-500">
            <p>No resume data available. Please go back and fill out the form.</p>
          </div>
        );
      }

      return <TemplateComponent jsonData={currentData} />;
    } catch (error) {
      console.error('Template rendering error:', error);
      return (
        <div className="p-8 text-center text-red-500">
          <p>Error rendering resume template. Please try refreshing or go back to edit.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      );
    }
  };

  const handleProceedToDownload = () => {
    navigate('/Result', {
      state: {
        jsonData: getCurrentData(),
        originalData: resumeData,
        versionType: selectedVersion
      }
    });
  };

  const handleBackToEdit = () => {
    // Navigate back to edit page with current resume data
    const dataToPass = selectedVersion === 'enhanced' && aiEnhancedData ? aiEnhancedData : resumeData;
    navigate('/GetInfo', { 
      state: { 
        jsonData: dataToPass,
        fromPreview: true
      } 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Use regular CSS instead of styled-jsx */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .preview-container {
              max-height: none !important;
              overflow: visible !important;
            }
            .resume {
              page-break-inside: avoid;
              max-height: none !important;
              height: auto !important;
            }
          }
          
          .resume {
            max-height: none;
            overflow: visible;
          }
          
          .preview-container {
            max-height: 85vh;
            overflow: auto;
            scrollbar-width: thin;
            scrollbar-color: #4a5568 #1a202c;
          }
          
          .preview-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .preview-container::-webkit-scrollbar-track {
            background: #1a202c;
          }
          
          .preview-container::-webkit-scrollbar-thumb {
            background: #4a5568;
            border-radius: 3px;
          }
          
          /* Force readable text colors in preview */
          .resume-preview-content * {
            color: inherit !important;
          }
          
          .resume-preview-content {
            color: #000000 !important;
          }
          
          .resume-preview-content h1,
          .resume-preview-content h2,
          .resume-preview-content h3,
          .resume-preview-content h4,
          .resume-preview-content h5,
          .resume-preview-content h6 {
            color: #1a1a1a !important;
          }
          
          .resume-preview-content p,
          .resume-preview-content div,
          .resume-preview-content span,
          .resume-preview-content li {
            color: #2d2d2d !important;
          }
          
          /* Keep specific styled elements */
          .resume-preview-content .TextLight,
          .resume-preview-content [class*="text-"],
          .resume-preview-content [class*="color"] {
            opacity: 1 !important;
          }
        `
      }} />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleBackToEdit}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Edit
            </motion.button>
            <h1 className="text-2xl font-bold">Resume Preview</h1>
          </div>

          {/* Top Controls */}
          <div className="flex items-center space-x-4">
            {/* AI Enhancement Button */}
            {!isEnhancing && !aiEnhancedData && (
              <motion.button
                onClick={enhanceWithAI}
                className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5 mr-2" />
                Resume Enhanced by AI
              </motion.button>
            )}

            {isEnhancing && (
              <div className="flex items-center text-blue-400">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                AI is enhancing your resume...
              </div>
            )}

            {/* Version Selector */}
            {aiEnhancedData && (
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setSelectedVersion('original')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedVersion === 'original' 
                      ? 'bg-gray-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setSelectedVersion('enhanced')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedVersion === 'enhanced' 
                      ? 'bg-gray-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-1 inline" />
                  AI Enhanced
                </button>
              </div>
            )}

            {/* Download Button */}
            <motion.button
              onClick={handleProceedToDownload}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5 mr-2" />
              Select Format & Download
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Status Banner */}
          {aiEnhancedData && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              selectedVersion === 'enhanced' 
                ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700 text-purple-200'
                : 'bg-gray-800/50 border border-gray-700 text-gray-300'
            }`}>
              {selectedVersion === 'enhanced' 
                ? '✨ Viewing AI-Enhanced Resume with improved content, keywords, and professional formatting'
                : '📝 Viewing Original Resume as you created it'
              }
            </div>
          )}

          {!aiEnhancedData && (
            <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center text-gray-300">
              📝 Viewing Original Resume - Click "Resume Enhanced by AI" to see improved version
            </div>
          )}

          {/* Resume Display */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-2xl overflow-auto max-w-[950px] w-full preview-container">
              <div className="p-8 resume-preview-content">
                {renderTemplate()}
              </div>
            </div>
          </div>

          {/* AI Enhancement Info */}
          {aiEnhancedData && selectedVersion === 'enhanced' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-800"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Enhancements Applied
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Added relevant skills based on your job role</li>
                <li>• Enhanced professional summary for better impact</li>
                <li>• Completed missing sections with appropriate content</li>
                <li>• Optimized for ATS (Applicant Tracking System) compatibility</li>
                <li>• Improved formatting and professional language</li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;