from flask import Blueprint, request, jsonify
from groq import Groq
import os
import json
import threading
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables
load_dotenv()

ai_bp = Blueprint('ai', __name__)

# Configure Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Groq model to use (fast and handles larger contexts)
GROQ_MODEL = "llama-3.3-70b-versatile"

def get_groq_client():
    """Get a Groq client instance with API key"""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable not set")
    return Groq(api_key=GROQ_API_KEY)

def safe_ai_call(prompt, max_retries=2):
    """Safely call Groq AI with error handling and retries"""
    for attempt in range(max_retries):
        try:
            client = get_groq_client()
            
            print(f"AI call attempt {attempt + 1}: Making Groq AI request")
            
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional resume writing assistant. Provide concise, actionable advice."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=4000
            )
            
            if response.choices and response.choices[0].message.content:
                content = response.choices[0].message.content
                print(f"SUCCESS: AI response received (length: {len(content)})")
                return content
            else:
                print(f"WARNING: Empty response from AI")
                return "AI generated an empty response. Please try rephrasing your request."
                
        except Exception as e:
            error_msg = str(e)
            print(f"AI call attempt {attempt + 1} failed: {error_msg}")
            
            if "invalid_api_key" in error_msg.lower() or "authentication" in error_msg.lower():
                return "Invalid API key. Please check your GROQ_API_KEY environment variable."
            elif "rate_limit" in error_msg.lower() or "429" in error_msg:
                print(f"WARNING: Rate limit hit, waiting before retry")
                if attempt < max_retries - 1:
                    continue
            elif "content_filter" in error_msg.lower():
                return "Content was blocked by safety filters. Please try different content."
            
            if attempt == max_retries - 1:
                return f"AI service error: {error_msg}"
    
    return "AI service temporarily unavailable. Please try again in a moment."

@ai_bp.route('/enhance-content', methods=['POST'])
def enhance_content():
    """Enhance resume content using AI"""
    try:
        data = request.get_json()
        content_type = data.get('type')
        content = data.get('content')
        job_title = data.get('jobTitle', '')
        context = data.get('context', {})
        
        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        prompts = {
            'description': f"""
                Enhance this professional summary for a {job_title} role. Make it more impactful, professional, and ATS-friendly:
                
                Original: {content}
                
                Requirements:
                - Keep it concise (2-3 lines)
                - Use action words and quantifiable achievements
                - Make it industry-specific
                - Ensure ATS keyword optimization
                - Sound professional and confident
                
                Return only the enhanced summary, no explanation.
            """,
            
            'skills': f"""
                Improve and organize these skills for a {job_title} position:
                
                Original: {content}
                
                Requirements:
                - Separate into Technical Skills and Soft Skills
                - Add relevant industry skills if missing
                - Prioritize most important skills first
                - Use proper formatting with commas
                - Ensure ATS-friendly keywords
                
                Format:
                Technical Skills: skill1, skill2, skill3...
                Soft Skills: skill1, skill2, skill3...
            """,
            
            'experience': f"""
                Enhance this work experience description for a {job_title}:
                
                Original: {content}
                
                Requirements:
                - Use strong action verbs (Developed, Implemented, Led, etc.)
                - Include quantifiable results where possible
                - Make it achievement-focused rather than task-focused
                - Keep it professional and impactful
                - Use bullet points if multiple achievements
                
                Return only the enhanced description.
            """,
            
            'project': f"""
                Improve this project description for a {job_title}'s resume:
                
                Original: {content}
                 
                Requirements:
                - Highlight technical achievements and impact
                - Mention technologies used clearly
                - Show problem-solving abilities
                - Include results or outcomes if possible
                - Keep it concise but comprehensive
                
                Return only the enhanced project description.
            """,
            
            'general': f"""
                Enhance this resume content for a {job_title} position:
                
                Original: {content}
                
                Make it more professional, impactful, and ATS-friendly while maintaining accuracy.
                Return only the enhanced content.
            """
        }
        
        prompt = prompts.get(content_type, prompts['general'])
        enhanced_content = safe_ai_call(prompt)
        
        return jsonify({
            'original': content,
            'enhanced': enhanced_content,
            'type': content_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/chatbot', methods=['POST'])
def chatbot():
    """AI chatbot for resume building assistance"""
    try:
        data = request.get_json()
        user_message = data.get('message')
        conversation_history = data.get('history', [])
        current_section = data.get('section', 'general')
        user_data = data.get('userData', {})
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        job_title = user_data.get('jobTitle', 'Professional')
        skills = user_data.get('skills', '')
        has_job_title = user_data.get('hasJobTitle', False)
        has_skills = user_data.get('hasSkills', False)
        has_experience = user_data.get('hasExperience', False)
        completion_level = user_data.get('completionLevel', 0)
        current_section = user_data.get('currentSection', 'general')
        
        context = f"""
        You are a professional resume writing assistant. The user is currently working on their resume.
        
        User Context:
        - Job Title: {job_title}
        - Current Section: {current_section}
        - Skills Listed: {skills[:100] if skills else 'Not provided yet'}
        - Form Completion: {completion_level}%
        - Has Experience Listed: {has_experience}
        
        Guidelines:
        - ALWAYS provide specific, actionable advice
        - Use the user's provided information to give personalized responses
        - If asking for descriptions, provide direct examples using their job title
        - Don't ask for information the user likely already provided
        - Focus on ATS optimization and professional standards
        - Be concise and immediately helpful
        
        Common Queries and How to Handle:
        - "good description" or "profile description" → Provide a sample professional summary using their job title
        - "skills" → Suggest industry-specific skills for their role
        - "experience" → Give examples of how to write achievement-focused descriptions
        - "keywords" → Provide ATS-friendly keywords for their industry
        
        User's Question: {user_message}
        
        Provide a direct, helpful response that uses their context where possible:
        """
        
        lower_message = user_message.lower()
        
        if any(word in lower_message for word in ['description', 'summary', 'about me', 'profile']):
            if job_title and job_title != 'Professional':
                context += f"""
                
                IMPORTANT: Provide a sample professional summary for a {job_title}. 
                Give 2-3 specific examples they can use or modify.
                Include industry keywords and quantifiable achievements.
                Don't ask for more details - be directly helpful.
                """
            else:
                context += f"""
                
                IMPORTANT: Provide general professional summary templates that work for most roles.
                Give 2-3 examples with placeholders they can customize.
                Include tips for making it ATS-friendly.
                """
        
        elif any(word in lower_message for word in ['skills', 'skill', 'abilities']):
            context += f"""
            
            IMPORTANT: Suggest specific skills for {job_title} role.
            Provide both technical and soft skills.
            Give examples they can copy-paste.
            Don't ask questions - be immediately helpful.
            """
        
        elif any(word in lower_message for word in ['experience', 'work', 'job', 'achievement']):
            context += f"""
            
            IMPORTANT: Show how to write impactful work experience descriptions.
            Use action verbs and quantifiable results.
            Give examples for {job_title} or similar roles.
            """
        
        response = safe_ai_call(context)
        
        return jsonify({
            'response': response,
            'section': current_section
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/suggest-improvements', methods=['POST'])
def suggest_improvements():
    """Analyze entire resume and suggest improvements"""
    try:
        data = request.get_json()
        resume_data = data.get('resumeData')
        job_title = resume_data.get('contactInfo', {}).get('jobTitle', '')
        
        prompt = f"""
        Analyze this resume data for a {job_title} position and provide specific improvement suggestions:
        
        Resume Data:
        {json.dumps(resume_data, indent=2)}
        
        Provide suggestions in the following categories:
        1. Content Improvements (specific sections that need work)
        2. Missing Information (what should be added)
        3. ATS Optimization (keyword suggestions)
        4. Structure & Formatting (organization improvements)
        5. Professional Impact (how to make it more compelling)
        
        Format as JSON:
        {{
            "contentImprovements": ["suggestion1", "suggestion2"],
            "missingInformation": ["missing1", "missing2"],
            "atsOptimization": ["keyword1", "keyword2"],
            "structure": ["structure1", "structure2"],
            "impact": ["impact1", "impact2"],
            "overallScore": 85
        }}
        """
        
        response = safe_ai_call(prompt)
        
        try:
            suggestions = json.loads(response)
        except:
            suggestions = {
                "contentImprovements": [response],
                "missingInformation": [],
                "atsOptimization": [],
                "structure": [],
                "impact": [],
                "overallScore": 75
            }
        
        return jsonify(suggestions)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/generate-keywords', methods=['POST'])
def generate_keywords():
    """Generate relevant keywords for ATS optimization"""
    try:
        data = request.get_json()
        job_title = data.get('jobTitle')
        industry = data.get('industry', '')
        skills = data.get('skills', '')
        
        prompt = f"""
        Generate ATS-optimized keywords for a {job_title} position in {industry} industry.
        Current skills: {skills}
        
        Provide:
        1. Technical keywords (10-15 most important)
        2. Soft skills keywords (5-8 relevant)
        3. Industry-specific terms (5-10)
        4. Action verbs for experience section (10)
        
        Format as JSON:
        {{
            "technical": ["keyword1", "keyword2"],
            "softSkills": ["skill1", "skill2"],
            "industry": ["term1", "term2"],
            "actionVerbs": ["verb1", "verb2"]
        }}
        """
        
        response = safe_ai_call(prompt)
        
        try:
            keywords = json.loads(response)
        except:
            keywords = {
                "technical": response.split(',')[:10] if response else [],
                "softSkills": [],
                "industry": [],
                "actionVerbs": []
            }
        
        return jsonify(keywords)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/test-ai', methods=['GET'])
def test_ai():
    """Test AI connection"""
    try:
        test_prompt = "Say 'Hello! AI is working correctly.' in a friendly way."
        result = safe_ai_call(test_prompt)
        return jsonify({
            'status': 'success',
            'response': result,
            'api_configured': True,
            'rate_limit': '30 requests/minute'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'api_configured': False
        }), 500

@ai_bp.route('/complete-resume', methods=['POST'])
def complete_resume():
    """Complete and enhance entire resume with AI"""
    try:
        data = request.get_json()
        resume_data = data.get('resumeData')
        action = data.get('action', 'complete_and_enhance')
        
        if not resume_data:
            return jsonify({'error': 'No resume data provided'}), 400
        
        contact_info = resume_data.get('contactInfo', {})
        job_title = contact_info.get('jobTitle', 'Professional')
        
        enhanced_resume = json.loads(json.dumps(resume_data))
        
        # Part 1: Enhance Description & Skills
        description = resume_data.get('Description', {}).get('UserDescription', '')
        skills = resume_data.get('skills', {})
        
        part1_prompt = f"""
        Enhance the professional summary and skills for a {job_title} position.
        
        Current Description: {description}
        Current Skills: {json.dumps(skills, indent=2)}
        
        Requirements:
        1. Professional Summary: Write 2-3 impactful sentences (max 200 characters). Focus on achievements, expertise, and value. NO MARKDOWN.
        2. Hard Skills: Add relevant technical skills as comma-separated list. Include industry keywords. NO MARKDOWN.
        3. Soft Skills: Add relevant soft skills as comma-separated list. NO MARKDOWN.
        
        Return ONLY as JSON:
        {{
            "description": "enhanced professional summary here",
            "hardSkills": "skill1, skill2, skill3, ...",
            "softSkills": "skill1, skill2, skill3, ..."
        }}
        """
        
        print("Enhancing Part 1/3: Description & Skills...")
        part1_response = safe_ai_call(part1_prompt)
        
        try:
            part1_data = json.loads(part1_response.strip().replace('```json', '').replace('```', '').strip())
            if part1_data.get('description'):
                enhanced_resume.setdefault('Description', {})['UserDescription'] = part1_data['description']
            if part1_data.get('hardSkills'):
                enhanced_resume.setdefault('skills', {})['hardSkills'] = part1_data['hardSkills']
            if part1_data.get('softSkills'):
                enhanced_resume.setdefault('skills', {})['softSkills'] = part1_data['softSkills']
        except:
            print("Part 1 parsing failed, using fallback")
        
        # Part 2: Enhance Work Experience
        work_experience = resume_data.get('workExperience', [])
        
        if work_experience and len(work_experience) > 0:
            part2_prompt = f"""
            Enhance work experience descriptions for a {job_title}.
            
            Current Work Experience:
            {json.dumps(work_experience, indent=2)}
            
            CRITICAL: Keep ALL existing fields intact (companyName, jobTitle, duration, startDate, endDate, etc.)
            ONLY enhance the keyAchievements field.
            
            For EACH job, enhance keyAchievements field:
            1. Write a concise paragraph (2-4 sentences, 150-250 characters)
            2. Start with role overview, then add 2-3 key achievements
            3. Use **bold** for action verbs (Developed, Led, Improved, etc.)
            4. Use **bold** for technologies, metrics, and results (React, Python, 40% improvement)
            5. Include quantifiable results where possible
            6. Make it achievement-focused, not task-focused
            
            Example format:
            "Led development of enterprise web applications. **Developed** and **deployed** full-stack solutions using **React.js** and **Node.js**. **Improved** system performance by **35%** and **reduced** load times significantly."
            
            Return ONLY as JSON array - preserve ALL original fields, only modify keyAchievements:
            [
                {{
                    "companyName": "keep original",
                    "jobTitle": "keep original",
                    "duration": "keep original",
                    "startDate": "keep original if exists",
                    "endDate": "keep original if exists",
                    "keyAchievements": "enhanced paragraph with **bold** keywords"
                }},
                ...
            ]
            """
            
            print("Enhancing Part 2/3: Work Experience...")
            part2_response = safe_ai_call(part2_prompt)
            
            try:
                part2_data = json.loads(part2_response.strip().replace('```json', '').replace('```', '').strip())
                if isinstance(part2_data, list) and len(part2_data) > 0:
                    for i, enhanced_exp in enumerate(part2_data):
                        if i < len(work_experience):
                            original_exp = work_experience[i]
                            for key in original_exp:
                                if key not in enhanced_exp or not enhanced_exp[key]:
                                    enhanced_exp[key] = original_exp[key]
                    enhanced_resume['workExperience'] = part2_data
            except:
                print("Part 2 parsing failed, keeping original")
        
        # Part 3: Enhance Projects
        projects = resume_data.get('projects', [])
        
        if projects and len(projects) > 0:
            part3_prompt = f"""
            Enhance project descriptions for a {job_title}'s resume.
            
            Current Projects:
            {json.dumps(projects, indent=2)}
            
            CRITICAL: Preserve ALL existing fields from the original projects.
            
            For EACH project:
            1. Keep projectTitle exactly as is
            2. CREATE or enhance projectDescription field: Write 2-3 impactful sentences (150-250 characters)
               - Describe what the project does and its impact
               - Use **bold** for key technologies and achievements
               - Include technical stack and measurable results
               - Make it professional and achievement-focused
            3. Keep or enhance toolsTechUsed: Comma-separated tech stack
            
            Example projectDescription:
            "E-commerce platform with real-time inventory management. Built using **React**, **Node.js**, **MongoDB**, and **AWS**. **Implemented** payment integration and **achieved** 99.9% uptime with **scalable** architecture."
            
            IMPORTANT: If projectDescription is empty or missing in original, you MUST create it.
            If it exists but is short/weak, enhance it significantly.
            
            Return ONLY as JSON array - preserve ALL original fields:
            [
                {{
                    "projectTitle": "keep original exactly",
                    "projectDescription": "CREATE/ENHANCE this 2-3 sentence description with **bold** keywords",
                    "toolsTechUsed": "keep or enhance",
                    ...preserve any other fields...
                }},
                ...
            ]
            """
            
            print("Enhancing Part 3/3: Projects...")
            part3_response = safe_ai_call(part3_prompt)
            
            try:
                part3_data = json.loads(part3_response.strip().replace('```json', '').replace('```', '').strip())
                if isinstance(part3_data, list) and len(part3_data) > 0:
                    for i, enhanced_proj in enumerate(part3_data):
                        if i < len(projects):
                            original_proj = projects[i]
                            for key in original_proj:
                                if key not in enhanced_proj or (key != 'projectDescription' and not enhanced_proj[key]):
                                    enhanced_proj[key] = original_proj[key]
                    enhanced_resume['projects'] = part3_data
                    print(f"Successfully enhanced {len(part3_data)} projects")
            except Exception as e:
                print(f"Part 3 parsing failed: {str(e)}, keeping original")
        
        print("Resume enhancement complete!")
        
        return jsonify({
            'enhancedResume': enhanced_resume,
            'original': resume_data
        })
        
    except Exception as e:
        print(f"Enhancement error: {str(e)}")
        try:
            enhanced_resume = create_fallback_enhancement(resume_data, resume_data.get('contactInfo', {}).get('jobTitle', 'Professional'))
            return jsonify({
                'enhancedResume': enhanced_resume,
                'original': resume_data,
                'note': f'Used fallback enhancement due to error: {str(e)}'
            })
        except:
            return jsonify({'error': str(e)}), 500

def create_fallback_enhancement(resume_data, job_title):
    """Create enhanced resume when AI response can't be parsed"""
    enhanced = json.loads(json.dumps(resume_data))
    
    if not enhanced.get('contactInfo', {}).get('jobTitle'):
        enhanced.setdefault('contactInfo', {})['jobTitle'] = job_title
    
    if not enhanced.get('Description', {}).get('UserDescription') or len(enhanced.get('Description', {}).get('UserDescription', '')) < 50:
        enhanced.setdefault('Description', {})['UserDescription'] = f"Experienced {job_title} with proven expertise in delivering results. Strong problem-solving and collaboration skills."
    
    skills = enhanced.setdefault('skills', {})
    if not skills.get('hardSkills') or len(skills.get('hardSkills', '')) < 20:
        if 'developer' in job_title.lower() or 'engineer' in job_title.lower():
            skills['hardSkills'] = "JavaScript, Python, React, Node.js, Git, SQL"
        elif 'designer' in job_title.lower():
            skills['hardSkills'] = "Figma, Adobe Creative Suite, UI/UX Design, Prototyping"
        elif 'manager' in job_title.lower():
            skills['hardSkills'] = "Project Management, Agile, Leadership, Analytics"
        else:
            skills['hardSkills'] = "Microsoft Office, Data Analysis, Communication, Problem Solving"
    
    if not skills.get('softSkills') or len(skills.get('softSkills', '')) < 20:
        skills['softSkills'] = "Leadership, Communication, Teamwork, Time Management, Adaptability"
    
    if enhanced.get('workExperience') and isinstance(enhanced['workExperience'], list):
        for exp in enhanced['workExperience']:
            if exp.get('keyAchievements') and len(exp['keyAchievements']) < 100:
                role = exp.get('jobTitle', 'Professional')
                exp['keyAchievements'] = f"Responsible for driving results and contributing to organizational success. **Delivered** high-quality work exceeding expectations and **collaborated** with cross-functional teams to **improve** processes and efficiency."
    
    if not enhanced.get('projects') or not enhanced['projects'][0].get('projectTitle'):
        enhanced['projects'] = [{
            'projectTitle': f"{job_title} Portfolio Project",
            'toolsTechUsed': skills.get('hardSkills', '').split(',')[0:3] if skills.get('hardSkills') else "Modern Technologies"
        }]
    
    return enhanced

@ai_bp.route('/generate-profile-suggestions', methods=['POST'])
def generate_profile_suggestions():
    """Generate profile description suggestions"""
    try:
        data = request.get_json()
        job_title = data.get('jobTitle', '')
        skills = data.get('skills', '')
        experience_level = data.get('experienceLevel', 'mid')
        
        if not job_title:
            return jsonify({'error': 'Job title is required'}), 400
        
        prompt = f"""
        Create 3 different professional summary suggestions for a {job_title} with {experience_level}-level experience.
        Skills: {skills}
        
        Each suggestion should be:
        - 2-3 sentences long
        - Professional and impactful
        - ATS-optimized with relevant keywords
        - Unique in tone and focus
        
        Suggestion 1: Achievement-focused
        Suggestion 2: Skills-focused  
        Suggestion 3: Industry-focused
        
        Format as JSON:
        {{
            "suggestions": [
                {{
                    "title": "Achievement-Focused",
                    "text": "suggestion text here"
                }},
                {{
                    "title": "Skills-Focused", 
                    "text": "suggestion text here"
                }},
                {{
                    "title": "Industry-Focused",
                    "text": "suggestion text here"
                }}
            ]
        }}
        """
        
        response = safe_ai_call(prompt)
        
        try:
            suggestions = json.loads(response)
        except:
            suggestions = {
                "suggestions": [
                    {
                        "title": "Achievement-Focused",
                        "text": f"Results-driven {job_title} with proven track record of delivering high-quality solutions and exceeding performance targets. Demonstrated expertise in driving organizational success through innovative problem-solving and strategic thinking."
                    },
                    {
                        "title": "Skills-Focused",
                        "text": f"Skilled {job_title} with comprehensive expertise in {skills.split(',')[0] if skills else 'relevant technologies'}. Strong analytical and technical abilities combined with excellent communication skills to deliver impactful results."
                    },
                    {
                        "title": "Industry-Focused", 
                        "text": f"Professional {job_title} passionate about leveraging cutting-edge technologies and industry best practices. Committed to continuous learning and delivering exceptional value to organizations and stakeholders."
                    }
                ]
            }
        
        return jsonify(suggestions)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ai_configured': GROQ_API_KEY is not None,
        'service': 'Resume AI Assistant'
    })
