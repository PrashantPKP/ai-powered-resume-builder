import React, { useState } from 'react';
import { Download, FileText, Code, Database, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { html as html_beautify } from 'js-beautify';
import { T1Css } from './T1.jsx';
import { T2Css } from './T2.jsx';
import { T3Css } from './T3.jsx';
import { T4Css } from './T4.jsx';
import { T5Css } from './T5.jsx';
import { T6Css } from './T6.jsx';

const DownloadModal = ({ isOpen, onClose, resumeData, selectedTemplate }) => {
  const [downloading, setDownloading] = useState({});
  const [downloadedFormats, setDownloadedFormats] = useState({});

  const downloadFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional PDF format for job applications',
      icon: FileText,
      color: 'bg-red-500',
      recommended: true
    },
    {
      id: 'html',
      name: 'HTML File',
      description: 'Web format for online portfolios',
      icon: Code,
      color: 'bg-blue-500',
      recommended: false
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Raw data for backup or transfer',
      icon: Database,
      color: 'bg-green-500',
      recommended: false
    }
  ];

  const handleDownload = async (format) => {
    setDownloading(prev => ({ ...prev, [format.id]: true }));
    
    try {
      switch (format.id) {
        case 'pdf':
          await downloadPDF();
          break;
        case 'html':
          await downloadHTML();
          break;
        case 'json':
          await downloadJSON();
          break;
      }
      
      setDownloadedFormats(prev => ({ ...prev, [format.id]: true }));
      toast.success(`${format.name} downloaded successfully!`);
    } catch (error) {
      console.error(`Download error for ${format.id}:`, error);
      toast.error(`Failed to download ${format.name}`);
    } finally {
      setDownloading(prev => ({ ...prev, [format.id]: false }));
    }
  };

  const downloadPDF = async () => {
    try {
      // Use the actual template HTML as shown in preview
      const htmlContent = generateActualTemplateHTML();
      
      // Use browser's print-to-PDF functionality (Best for preserving styling)
      toast('Opening print dialog. Select "Save as PDF" or "Microsoft Print to PDF" to download.', {
        duration: 6000,
        icon: '🖨️'
      });
      
      // Create a hidden iframe with the styled content
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      // Write content to iframe
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Wait for content to load, then trigger print
      iframe.contentWindow.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          // Clean up after print dialog closes (give user time)
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 500);
      };
      
      // Fallback: trigger onload manually if it doesn't fire
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      }, 1000);
      
    } catch (error) {
      console.error('PDF download error:', error);
      
      // Final fallback: download HTML
      const htmlContent = generateActualTemplateHTML();
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      downloadBlob(htmlBlob, 'resume.html', 'text/html');
      toast('Downloaded as HTML. Open it and press Ctrl+P, then select "Save as PDF".', {
        icon: 'ℹ️',
        duration: 6000
      });
    }
  };

  const downloadHTML = async () => {
    const htmlContent = generateActualTemplateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadBlob(blob, 'resume.html', 'text/html');
  };

  const downloadJSON = async () => {
    const jsonData = {
      metadata: {
        generatedOn: new Date().toISOString(),
        template: selectedTemplate,
        version: '1.0'
      },
      resumeData: resumeData
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, 'resume-data.json', 'application/json');
  };

  const generateActualTemplateHTML = () => {
    // Import the template CSS based on selected template
    const getTemplateCss = () => {
      const templateCssMap = {
        '1': T1Css,
        '2': T2Css,
        '3': T3Css,
        '4': T4Css,
        '5': T5Css,
        '6': T6Css
      };
      return templateCssMap[selectedTemplate] || T1Css;
    };

    // Try to get the actual rendered HTML from the preview
    // First try to find by ID (used in Result.jsx)
    let captureElement = document.getElementById('capture-content');
    
    // If not found, try to find by class (used in preview pages)
    if (!captureElement) {
      captureElement = document.querySelector('.resume');
    }
    
    if (captureElement) {
      // Get the inner content of the template
      const templateHTML = captureElement.innerHTML;
      const templateCss = getTemplateCss();
      
      // Get the user's name for the title
      const userName = resumeData.contactInfo?.fullName || 
                      resumeData.contactInfo?.name || 
                      'Resume';
      
      const generatedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userName}</title>
    <style>
      ${templateCss}
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="icon" href="https://prashantparshuramkar.host20.uk/cv-templates/resume-icon.png">
</head>
<body>
    ${templateHTML}
</body>
</html>`;
      
      // Beautify the HTML for better readability
      return html_beautify(generatedCode);
    }
    
    // Fallback: generate basic HTML if element not found
    console.warn('Template element not found in DOM, using fallback HTML');
    return generateFallbackHTML();
  };

  const generateFallbackHTML = () => {
    const { contactInfo, Description, experience, education, skills, projects, certifications } = resumeData;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contactInfo?.fullName || contactInfo?.name || 'Resume'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .name { font-size: 2.5rem; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
        .job-title { font-size: 1.2rem; color: #6b7280; margin-bottom: 15px; }
        .contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .contact span { color: #4b5563; font-size: 0.9rem; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 1.4rem; font-weight: bold; color: #1e3a8a; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .description { text-align: justify; color: #4b5563; line-height: 1.7; }
        .item { margin-bottom: 15px; }
        .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .item-title { font-weight: bold; color: #1f2937; }
        .item-date { color: #6b7280; font-size: 0.9rem; }
        .item-subtitle { color: #4b5563; font-style: italic; margin-bottom: 5px; }
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .skill-category h4 { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
        .skill-list { color: #4b5563; }
        .projects { display: grid; gap: 15px; }
        .project { padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .project-title { font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
        .project-tech { color: #6b7280; font-size: 0.9rem; font-style: italic; }
        @media print { body { max-width: none; margin: 0; padding: 15px; font-size: 12px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">${contactInfo?.fullName || contactInfo?.name || 'Your Name'}</h1>
        <div class="job-title">${contactInfo?.jobTitle || 'Professional Title'}</div>
        <div class="contact">
            ${contactInfo?.emailAddress || contactInfo?.email ? `<span>📧 ${contactInfo.emailAddress || contactInfo.email}</span>` : ''}
            ${contactInfo?.phoneNumber || contactInfo?.phone ? `<span>📞 ${contactInfo.phoneNumber || contactInfo.phone}</span>` : ''}
            ${contactInfo?.Location || contactInfo?.location ? `<span>📍 ${contactInfo.Location || contactInfo.location}</span>` : ''}
            ${contactInfo?.linkedin ? `<span>💼 LinkedIn: ${contactInfo.linkedin}</span>` : ''}
            ${contactInfo?.portfolio || contactInfo?.github ? `<span>💻 ${contactInfo.portfolio || contactInfo.github}</span>` : ''}
        </div>
    </div>

    ${Description?.UserDescription ? `
    <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="description">${Description.UserDescription}</p>
    </div>
    ` : ''}

    ${resumeData.workExperience && resumeData.workExperience.length > 0 && resumeData.workExperience[0]?.jobTitle ? `
    <div class="section">
        <h2 class="section-title">Experience</h2>
        ${resumeData.workExperience.map(exp => `
            <div class="item">
                <div class="item-header">
                    <div class="item-title">${exp.jobTitle || ''}</div>
                    <div class="item-date">${exp.WorkDuration || ''}</div>
                </div>
                <div class="item-subtitle">${exp.companyName || ''}</div>
                ${exp.keyAchievements ? `<p style="color: #4b5563; margin-top: 5px;">${exp.keyAchievements}</p>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${education && education.length > 0 && education[0]?.degreeName ? `
    <div class="section">
        <h2 class="section-title">Education</h2>
        ${education.map(edu => `
            <div class="item">
                <div class="item-header">
                    <div class="item-title">${edu.degreeName || ''}</div>
                    <div class="item-date">${edu.graduationYear || ''}</div>
                </div>
                <div class="item-subtitle">${edu.institutionName || ''}</div>
                ${edu.currentCGPA ? `<p style="color: #4b5563; margin-top: 5px;">CGPA: ${edu.currentCGPA}</p>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${skills && (skills.hardSkills || skills.softSkills) ? `
    <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
            ${skills.hardSkills ? `
                <div class="skill-category">
                    <h4>Technical Skills</h4>
                    <p class="skill-list">${skills.hardSkills}</p>
                </div>
            ` : ''}
            ${skills.softSkills ? `
                <div class="skill-category">
                    <h4>Soft Skills</h4>
                    <p class="skill-list">${skills.softSkills}</p>
                </div>
            ` : ''}
        </div>
    </div>
    ` : ''}

    ${resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0]?.projectTitle ? `
    <div class="section">
        <h2 class="section-title">Projects</h2>
        <div class="projects">
            ${resumeData.projects.map(project => `
                <div class="project">
                    <div class="project-title">${project.projectTitle || ''}</div>
                    <div class="project-tech">${project.toolsTechUsed || ''}</div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${resumeData.certificates && resumeData.certificates.length > 0 && resumeData.certificates[0]?.certificateName ? `
    <div class="section">
        <h2 class="section-title">Certifications</h2>
        ${resumeData.certificates.map(cert => `
            <div class="item">
                <div class="item-header">
                    <div class="item-title">${cert.certificateName || ''}</div>
                    <div class="item-date">${cert.courseDuration || ''}</div>
                </div>
                <div class="item-subtitle">${cert.providerName || ''}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;
  };

  const downloadBlob = (blob, filename, mimeType) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    for (const format of downloadFormats) {
      if (!downloadedFormats[format.id]) {
        await handleDownload(format);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  const getFileName = () => {
    const name = resumeData.contactInfo?.name || 'Resume';
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
    return cleanName;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Download Resume
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose your preferred format
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {downloadFormats.map((format) => {
                const IconComponent = format.icon;
                const isDownloading = downloading[format.id];
                const isDownloaded = downloadedFormats[format.id];

                return (
                  <motion.div
                    key={format.id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      format.recommended
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    } ${isDownloaded ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isDownloading && handleDownload(format)}
                  >
                    {format.recommended && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${format.color} bg-opacity-20`}>
                          <IconComponent className={`w-5 h-5 ${format.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {format.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isDownloading && (
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isDownloaded && !isDownloading && (
                          <Check className="w-6 h-6 text-green-600" />
                        )}
                        {!isDownloading && !isDownloaded && (
                          <Download className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Download All Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={downloadAll}
                disabled={Object.keys(downloadedFormats).length === downloadFormats.length}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                <span>
                  {Object.keys(downloadedFormats).length === downloadFormats.length 
                    ? 'All Formats Downloaded' 
                    : 'Download All Formats'}
                </span>
              </motion.button>
            </div>

            {/* File Info */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>File name:</strong> {getFileName()}_resume
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Files will be saved to your default download folder
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadModal;