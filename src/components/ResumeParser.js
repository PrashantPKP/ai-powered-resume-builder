import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker - using the npm package's worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Parse PDF file and extract text
 */
async function parsePDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Parse DOCX file and extract text
 */
async function parseDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

/**
 * Extract email from text
 */
function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : '';
}

/**
 * Extract phone number from text
 */
function extractPhone(text) {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : '';
}

/**
 * Extract LinkedIn URL from text
 */
function extractLinkedIn(text) {
  const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi;
  const matches = text.match(linkedinRegex);
  return matches ? matches[0] : '';
}

/**
 * Extract GitHub/Portfolio URL from text
 */
function extractPortfolio(text) {
  const githubRegex = /(https?:\/\/)?(www\.)?(github\.com|portfolio|.*\.com)\/[a-zA-Z0-9_-]+/gi;
  const matches = text.match(githubRegex);
  if (matches) {
    // Filter out LinkedIn and email domains
    const filtered = matches.filter(url => 
      !url.toLowerCase().includes('linkedin') && 
      !url.toLowerCase().includes('@')
    );
    return filtered[0] || '';
  }
  return '';
}

/**
 * Extract name (usually first 1-2 lines)
 */
function extractName(text) {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Try to find name in first 5 lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip common header words
    if (line.toLowerCase().match(/resume|curriculum|vitae|cv|profile|contact/)) {
      continue;
    }
    
    // Name should be 2-50 chars, no @ or numbers, mostly letters
    if (line.length >= 2 && line.length <= 50 && 
        !line.includes('@') && 
        !line.match(/\d{3}/) &&
        !line.match(/https?:\/\//i) &&
        line.match(/[a-zA-Z]/g) &&
        line.match(/[a-zA-Z]/g).length > line.length * 0.6) {
      
      // Clean up the name
      return line
        .replace(/[|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
  
  return '';
}

/**
 * Extract location/address
 */
function extractLocation(text) {
  // Look for city, state patterns
  const locationRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z]{2}|[A-Z][a-z]+)\b/;
  const lines = text.split('\n').slice(0, 10); // Check first 10 lines
  
  for (let line of lines) {
    const match = line.match(locationRegex);
    if (match && !line.includes('@') && !line.match(/https?/)) {
      return match[0];
    }
  }
  
  return '';
}

/**
 * Extract skills section
 */
function extractSkills(text) {
  const skillsRegex = /(?:skills?|technical skills?|technologies?|expertise|competencies)[:\s]+(.*?)(?=\n\n|education|experience|projects?|certification|$)/gis;
  const match = text.match(skillsRegex);
  
  if (match && match[1]) {
    // Clean up and format skills
    let skillsText = match[1]
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[•\-\*]/g, ',')
      .trim();
    
    // Remove common non-skill words
    skillsText = skillsText.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 50)
      .join(', ');
    
    return skillsText;
  }
  
  return '';
}

/**
 * Extract education section
 */
function extractEducation(text) {
  const educationRegex = /(?:education|academic|qualification)[:\s]*\n+(.*?)(?=\n\n\n|experience|work|employment|skills?|projects?|certification|achievements|$)/gis;
  const match = text.match(educationRegex);
  
  if (match && match[1]) {
    const eduText = match[1];
    const lines = eduText.split('\n').map(l => l.trim()).filter(l => l);
    
    const education = [];
    let currentEdu = { institutionName: '', degreeName: '', graduationYear: '', currentCGPA: '' };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for degree keywords (usually comes first)
      if (line.match(/bachelor|master|phd|doctorate|diploma|b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|bca|mca|b\.?sc|m\.?sc|b\.?a\.?|m\.?a\.?|degree|engineering|science|arts|commerce/i)) {
        // Save previous education entry if exists
        if (currentEdu.degreeName || currentEdu.institutionName) {
          education.push({ ...currentEdu });
        }
        currentEdu = { institutionName: '', degreeName: line, graduationYear: '', currentCGPA: '' };
      }
      // Check for university/institution (usually contains these keywords)
      else if (line.match(/university|college|institute|school|iit|nit|academy/i) && line.length > 5) {
        currentEdu.institutionName = line;
      }
      // Check for year (4 digit year)
      else if (line.match(/\b(19|20)\d{2}\b/)) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        currentEdu.graduationYear = yearMatch ? yearMatch[0] : '';
        
        // Check if GPA/CGPA is on same line
        const gradeMatch = line.match(/(\d+\.?\d*)\s*(?:cgpa|gpa|grade|%)/i);
        if (gradeMatch) {
          currentEdu.currentCGPA = gradeMatch[1];
        }
      }
      // Check for GPA/CGPA (standalone or with percentage)
      else if (line.match(/gpa|cgpa|grade|percentage|marks|score/i)) {
        const gradeMatch = line.match(/(\d+\.?\d*)\s*(?:\/\s*\d+)?/);
        if (gradeMatch && !currentEdu.currentCGPA) {
          currentEdu.currentCGPA = gradeMatch[1];
        }
      }
      // If line has institution keywords but we already have degree, it's institution
      else if (currentEdu.degreeName && !currentEdu.institutionName && line.length > 10) {
        currentEdu.institutionName = line;
      }
    }
    
    // Push the last education entry
    if (currentEdu.degreeName || currentEdu.institutionName) {
      education.push(currentEdu);
    }
    
    return education.length > 0 ? education : [{ institutionName: '', degreeName: '', graduationYear: '', currentCGPA: '' }];
  }
  
  return [{ institutionName: '', degreeName: '', graduationYear: '', currentCGPA: '' }];
}

/**
 * Extract work experience
 */
function extractExperience(text) {
  const expRegex = /(?:experience|employment|work\s+history|professional\s+experience)[:\s]*\n+(.*?)(?=\n\n\n|education|skills?|projects?|certification|achievements|$)/gis;
  const match = text.match(expRegex);
  
  if (match && match[1]) {
    const expText = match[1];
    const lines = expText.split('\n').map(l => l.trim()).filter(l => l);
    
    const experience = [];
    let currentExp = { jobTitle: '', companyName: '', WorkDuration: '', keyAchievements: '' };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for job titles (common job keywords)
      if (line.match(/\b(developer|engineer|manager|analyst|designer|consultant|architect|lead|senior|junior|intern|associate|specialist|executive|director|coordinator|assistant|administrator|officer|representative)\b/i) && 
          line.length < 100) {
        
        // Save previous experience if exists
        if (currentExp.jobTitle || currentExp.companyName) {
          experience.push({ ...currentExp });
        }
        
        // Try to extract job title and company if both on same line (e.g., "Software Engineer at Google")
        const atMatch = line.match(/^(.+?)\s+(?:at|@|-)\s+(.+)$/i);
        if (atMatch) {
          currentExp = { 
            jobTitle: atMatch[1].trim(), 
            companyName: atMatch[2].trim(), 
            WorkDuration: '', 
            keyAchievements: '' 
          };
        } else {
          currentExp = { jobTitle: line, companyName: '', WorkDuration: '', keyAchievements: '' };
        }
      }
      // Check for company name (if we have job title but no company yet)
      else if (currentExp.jobTitle && !currentExp.companyName && 
               line.length > 3 && line.length < 80 &&
               !line.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current)\b/i) &&
               !line.match(/^[•\-\*]/) &&
               line.match(/[a-zA-Z]/)) {
        currentExp.companyName = line;
      }
      // Check for date range (month/year patterns)
      else if (line.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current|\d{4})/i) && 
               line.match(/[-–—to|]/i)) {
        currentExp.WorkDuration = line;
      }
      // Collect achievements/responsibilities (lines starting with bullet or containing action verbs)
      else if (currentExp.jobTitle && 
               (line.match(/^[•\-\*]/) || line.length > 20) &&
               !line.match(/^(experience|employment|work|education|skills|projects)/i)) {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '');
        if (cleanLine.length > 10) {
          currentExp.keyAchievements += (currentExp.keyAchievements ? '\n' : '') + cleanLine;
        }
      }
    }
    
    // Push the last experience entry
    if (currentExp.jobTitle || currentExp.companyName) {
      experience.push(currentExp);
    }
    
    return experience.length > 0 ? experience : [{ jobTitle: '', companyName: '', WorkDuration: '', keyAchievements: '' }];
  }
  
  return [{ jobTitle: '', companyName: '', WorkDuration: '', keyAchievements: '' }];
}

/**
 * Main function to parse resume and extract structured data
 */
export async function parseResume(file) {
  try {
    let text = '';
    
    // Parse based on file type
    if (file.type === 'application/pdf') {
      text = await parsePDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.name.endsWith('.docx')) {
      text = await parseDOCX(file);
    } else if (file.type === 'application/msword' || file.name.endsWith('.doc')) {
      throw new Error('Old .doc format not supported. Please use .docx format.');
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }

    console.log('Extracted text (first 500 chars):', text.substring(0, 500));

    // Extract structured data
    const structuredData = {
      selectedTemplate: "1", // Default template
      contactInfo: {
        fullName: extractName(text),
        phoneNumber: extractPhone(text),
        emailAddress: extractEmail(text),
        linkedin: extractLinkedIn(text),
        portfolio: extractPortfolio(text),
        jobTitle: '',
        Languages: '',
        Location: extractLocation(text),
        profileImage: ''
      },
      skills: {
        hardSkills: extractSkills(text),
        softSkills: ''
      },
      workExperience: extractExperience(text),
      projects: [{ projectTitle: '', toolsTechUsed: '' }],
      education: extractEducation(text),
      certificates: [{ certificateName: '', courseDuration: '', providerName: '' }],
      Description: {
        UserDescription: ''
      }
    };

    console.log('Parsed data:', structuredData);

    return {
      success: true,
      data: structuredData,
      rawText: text
    };
  } catch (error) {
    console.error('Parse error:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}
