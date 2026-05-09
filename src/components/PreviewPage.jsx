import React, { useState, useEffect, useRef } from 'react';
import { API_URLS } from '../config/api';
import { ArrowLeft, Brain, Download, Sparkles, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {T1} from './T1.jsx';
import {T2} from './T2.jsx';
import {T3} from './T3.jsx';
import {T4} from './T4.jsx';
import {T5} from './T5.jsx';
import {T6} from './T6.jsx';
import DownloadModal from './DownloadModal.jsx';

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeData, originalData } = location.state || {};
  
  const [aiEnhancedData, setAiEnhancedData] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('original'); // 'original' or 'enhanced'
  const [showSkillEditor, setShowSkillEditor] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // If no data, redirect back
  if (!resumeData) {
    navigate('/');
    return null;
  }

  const enhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch(API_URLS.AI_COMPLETE_RESUME, {
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
        
        // Check if the response contains an error or the original data unchanged
        if (data.error || (data.enhancedResume && JSON.stringify(data.enhancedResume) === JSON.stringify(resumeData))) {
          throw new Error(data.error || 'No enhancements made');
        }
        
        const cleanedData = cleanupMarkdownInNonTargetSections(data.enhancedResume);
        setAiEnhancedData(cleanedData);
        setSelectedVersion('enhanced');
        toast.success('Resume enhanced with AI!');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Enhancement failed';
        
        // Check for quota error
        if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
          toast.error('API quota exceeded. Using built-in enhancements instead.', { duration: 4000 });
        } else {
          toast.error(errorMessage);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
      
      // Show appropriate message based on error type
      const errorMsg = error.message || '';
      if (errorMsg.includes('quota') || errorMsg.includes('rate limit') || errorMsg.includes('429')) {
        toast.info('API limit reached. Using built-in AI enhancements...', { duration: 3000 });
      }
      
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

    // ALWAYS enhance skills to show visible improvement - NO MARKDOWN FORMATTING
    const jobTitle = enhanced.contactInfo.jobTitle.toLowerCase();
    const additionalSkills = getSkillSuggestions(jobTitle);
    
    if (enhanced.skills.hardSkills) {
      // Add additional skills if not already present
      const existingSkills = enhanced.skills.hardSkills.toLowerCase();
      const skillsToAdd = additionalSkills.split(', ').filter(skill => 
        !existingSkills.includes(skill.toLowerCase())
      );
      if (skillsToAdd.length > 0) {
        enhanced.skills.hardSkills = `${enhanced.skills.hardSkills}, ${skillsToAdd.slice(0, 3).join(', ')}`;
      }
    } else {
      enhanced.skills.hardSkills = additionalSkills;
    }

    if (enhanced.skills.softSkills) {
      const softSkillsToAdd = ['Strategic Thinking', 'Analytical Skills', 'Adaptability'];
      const existingSoftSkills = enhanced.skills.softSkills.toLowerCase();
      const newSoftSkills = softSkillsToAdd.filter(skill => 
        !existingSoftSkills.includes(skill.toLowerCase())
      );
      if (newSoftSkills.length > 0) {
        enhanced.skills.softSkills = `${enhanced.skills.softSkills}, ${newSoftSkills.join(', ')}`;
      }
    } else {
      enhanced.skills.softSkills = 'Communication, Problem Solving, Leadership, Teamwork, Time Management, Adaptability';
    }

    // Clean up any markdown from skills
    if (enhanced.skills.hardSkills) {
      enhanced.skills.hardSkills = enhanced.skills.hardSkills.replace(/\*\*/g, '');
    }
    if (enhanced.skills.softSkills) {
      enhanced.skills.softSkills = enhanced.skills.softSkills.replace(/\*\*/g, '');
    }

    // ALWAYS enhance description to show improvement - NO MARKDOWN
    if (enhanced.Description?.UserDescription && enhanced.Description.UserDescription.length > 20) {
      // Improve existing description
      const desc = enhanced.Description.UserDescription;
      if (!desc.toLowerCase().includes('proven')) {
        enhanced.Description.UserDescription = `Proven and ${desc.charAt(0).toLowerCase()}${desc.slice(1)}`;
      }
    } else {
      enhanced.Description = enhanced.Description || {};
      const skills = enhanced.skills.hardSkills?.split(',').slice(0, 3).map(s => s.trim()).join(', ') || 'various technologies';
      enhanced.Description.UserDescription = `Experienced ${enhanced.contactInfo.jobTitle} with proven expertise in ${skills}. Demonstrated track record in delivering high-quality solutions and driving team success through effective collaboration and innovative problem-solving.`;
    }

    // Clean up any markdown from description
    if (enhanced.Description?.UserDescription) {
      enhanced.Description.UserDescription = enhanced.Description.UserDescription.replace(/\*\*/g, '');
    }

    // ALWAYS enhance work experience with better formatting - KEEP MARKDOWN
    if (enhanced.workExperience && Array.isArray(enhanced.workExperience)) {
      enhanced.workExperience = enhanced.workExperience.map((exp, index) => {
        if (exp.keyAchievements && exp.keyAchievements.length > 50) {
          // Improve existing achievements by adding action verbs
          let achievements = exp.keyAchievements;
          if (!achievements.includes('**')) {
            // Add some emphasis if not already there
            achievements = achievements.replace(/\b(developed|implemented|created|designed|built|improved|optimized|achieved|delivered|led|managed)\b/gi, '**$1**');
          }
          return { ...exp, keyAchievements: achievements };
        } else {
          return {
            ...exp,
            keyAchievements: `**Delivered** high-quality results and **contributed** to team success. **Implemented** innovative solutions that **improved** efficiency by 25% and **collaborated** with cross-functional teams to **achieve** measurable results.`
          };
        }
      });
    }

    // Enhance projects with better tech descriptions - KEEP MARKDOWN
    if (enhanced.projects && Array.isArray(enhanced.projects)) {
      enhanced.projects = enhanced.projects.map(project => {
        if (project.toolsTechUsed && project.toolsTechUsed.length > 20) {
          // Add emphasis to key technologies
          let tools = project.toolsTechUsed;
          if (!tools.includes('**')) {
            // Emphasize first few technologies
            const techArray = tools.split(',').map((t, i) => i < 3 ? `**${t.trim()}**` : t.trim());
            tools = techArray.join(', ');
          }
          return { ...project, toolsTechUsed: tools };
        }
        return project;
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

  const removeSkill = (skillType, skillToRemove) => {
    if (selectedVersion !== 'enhanced' || !aiEnhancedData) return;

    const skills = aiEnhancedData.skills[skillType].split(',').map(s => s.trim()).filter(s => s !== '');
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    
    const updatedData = {
      ...aiEnhancedData,
      skills: {
        ...aiEnhancedData.skills,
        [skillType]: updatedSkills.join(', ')
      }
    };
    
    setAiEnhancedData(updatedData);
    toast.success(`Removed "${skillToRemove}" from ${skillType === 'hardSkills' ? 'Technical' : 'Soft'} Skills`);
  };

  const getSkillsArray = (skillType) => {
    const currentData = getCurrentData();
    if (!currentData?.skills?.[skillType]) return [];
    return currentData.skills[skillType].split(',').map(s => s.trim()).filter(s => s !== '');
  };

  const SkillTag = ({ skill, skillType, onRemove, isEnhanced }) => (
    <div className="group relative inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors m-1">
      <span>{skill}</span>
      {isEnhanced && onRemove && (
        <button
          onClick={() => onRemove(skillType, skill)}
          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 hover:text-red-800 focus:outline-none"
          title="Remove skill"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

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
    setShowDownloadModal(true);
  };

  const handleDownloadComplete = () => {
    setShowDownloadModal(false);
    setShowThankYou(true);
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Thank You Page */}
      {showThankYou && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative"
          >
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
              <p className="text-gray-600 mb-8">Your resume has been downloaded successfully. What would you like to do next?</p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowThankYou(false);
                    navigate('/GetInfo', { 
                      state: { 
                        jsonData: getCurrentData(),
                        fromPreview: true
                      } 
                    });
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Resume / Try Different Template
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Start Fresh Resume
                </button>

                <button
                  onClick={() => navigate('/AboutUs')}
                  className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Suggest Improvements
                </button>

                <button
                  onClick={() => setShowThankYou(false)}
                  className="w-full flex items-center justify-center gap-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Stay on Preview
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
            max-height: none;
            overflow: visible;
          }
          
          .preview-container::-webkit-scrollbar {
            display: none;
          }
          
          /* Preserve template colors */
        `
      }} />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleBackToEdit}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Edit
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900">Resume Preview</h1>
          </div>

          {/* Top Controls */}
          <div className="flex items-center space-x-4">
            {/* AI Enhancement Button */}
            {!isEnhancing && !aiEnhancedData && (
              <motion.button
                onClick={enhanceWithAI}
                className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5 mr-2" />
                Resume Enhanced by AI
              </motion.button>
            )}

            {isEnhancing && (
              <div className="flex items-center text-blue-600">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                AI is enhancing your resume...
              </div>
            )}

            {/* Version Selector */}
            {aiEnhancedData && (
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setSelectedVersion('original')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedVersion === 'original' 
                      ? 'bg-white text-gray-900 shadow' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setSelectedVersion('enhanced')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedVersion === 'enhanced' 
                      ? 'bg-white text-gray-900 shadow' 
                      : 'text-gray-600 hover:text-gray-900'
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
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
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
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-purple-800'
                : 'bg-gray-100 border border-gray-300 text-gray-700'
            }`}>
              {selectedVersion === 'enhanced' 
                ? '✨ Viewing AI-Enhanced Resume with improved content, keywords, and professional formatting'
                : '📝 Viewing Original Resume as you created it'
              }
            </div>
          )}

          {!aiEnhancedData && (
            <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center text-gray-700">
              📝 Viewing Original Resume - Click "Resume Enhanced by AI" to see improved version
            </div>
          )}

          {/* Main Layout - Resume on left, Skills Editor on right */}
          <div className={`flex gap-6 ${aiEnhancedData && selectedVersion === 'enhanced' ? '' : 'justify-center'}`}>
            {/* Left Column - Resume and AI Enhancements Info */}
            <div className={`space-y-6 ${aiEnhancedData && selectedVersion === 'enhanced' ? 'flex-1' : 'max-w-[950px] w-full'}`}>
              {/* Resume Display */}
              <div className="bg-white rounded-lg shadow-2xl w-full preview-container">
                <div className="p-8 resume-preview-content">
                  {renderTemplate()}
                </div>
              </div>

              {/* AI Enhancement Info - Below Resume */}
              {aiEnhancedData && selectedVersion === 'enhanced' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Enhancements Applied
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Added relevant skills based on your profile</li>
                    <li>• Enhanced professional summary</li>
                    <li>• Improved content formatting</li>
                    <li>• Optimized keywords for ATS systems</li>
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Right Column - Skills Editor */}
            {aiEnhancedData && selectedVersion === 'enhanced' && (
              <div className="w-96">
                {/* Skills Editor */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg sticky top-24"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-purple-600 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      AI-Enhanced Skills
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {/* Technical Skills */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {getSkillsArray('hardSkills').map((skill, index) => (
                          <SkillTag 
                            key={index} 
                            skill={skill} 
                            skillType="hardSkills"
                            onRemove={removeSkill}
                            isEnhanced={true}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {getSkillsArray('softSkills').map((skill, index) => (
                          <SkillTag 
                            key={index} 
                            skill={skill} 
                            skillType="softSkills"
                            onRemove={removeSkill}
                            isEnhanced={true}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                      💡 Hover over any skill to see the delete icon. Click to remove unwanted skills.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={handleDownloadComplete}
          resumeData={getCurrentData()}
          selectedTemplate={resumeData.selectedTemplate}
        />
      )}

      {/* Footer Suggestion */}
      <div className="text-center py-4 text-sm text-gray-600">
        🔧 Have suggestions for improvements?{" "}
        <button 
          onClick={() => navigate('/AboutUs')}
          className="text-blue-600 hover:underline font-medium"
        >
          Visit About Us
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;