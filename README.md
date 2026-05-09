# Resume Builder 🚀

A modern, AI-powered resume builder application that helps users create professional resumes with multiple templates, real-time preview, and AI suggestions.

**Live Demo:** https://resume.zapsas.info/

---

## ✨ Features

### 🎨 **Multiple Resume Templates**
- 6 professionally designed templates to choose from
- **Template 1:** Simpler and Structured
- **Template 2:** Linear and Classic
- **Template 3:** Colourful and Attractive
- **Template 4:** Colourful and Highly Designed 
- **Template 5:** Simpler and Linear
- **Template 6:** Highly Simpler and Classic

### 📝 **Comprehensive Resume Sections**
- **Contact Information** - Name, phone, email, LinkedIn, portfolio, job title, languages, location
- **Skills** - Hard skills and soft skills with auto-suggestions
- **Work Experience** - Job title, company, duration, key achievements
- **Projects** - Project title, tools/tech used
- **Education** - Institution, degree, graduation year, CGPA
- **Certificates** - Certificate name, duration, provider
- **Professional Summary** - AI-generated or custom descriptions

### 🤖 **AI-Powered Features**
- **AI Analysis** - Get detailed feedback on your resume
- **AI Suggestions** - Receive improvement recommendations
- **Smart Descriptions** - Generate professional summaries automatically
- **Keyword Optimization** - ATS-friendly keyword suggestions
- **Resume Enhancement** - AI-powered content improvements

### 👀 **Real-Time Preview**
- Live preview of your resume as you fill in details
- Instant template switching
- See changes reflected immediately
- Dark mode support

### 📥 **File Management**
- **PDF Download** - Export your resume as PDF
- **HTML Download** - Get HTML version of your resume
- **File Upload** - Upload existing resume files for parsing
- **Data Persistence** - Resume data available during session

### 🔍 **Additional Features**
- **Example Data** - Load sample resume for quick testing
- **Multi-Step Form** - Guided step-by-step resume building
- **Dark/Light Mode** - Toggle between themes
- **Mobile Responsive** - Works on all devices
- **View Counter** - Track total application views
- **Resume Counter** - Track total resumes built
- **Responsive Design** - Optimized UI/UX

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Typed.js** - Text animation
- **JS Beautify** - HTML formatting
- **jsPDF & html2canvas** - PDF generation

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Google Generative AI (Gemini)** - AI features
- **WeasyPrint/xhtml2pdf** - PDF generation

### Database
- **Firebase Realtime Database** - Data storage (optional, currently disabled)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/PrashantPKP/ai-powered-resume-builder.git
cd Resume-Builder
```

#### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "REACT_APP_FIREBASE_URL=your_firebase_url" > .env.local

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

#### 3. AI Backend Setup

```bash
# Navigate to AI backend directory
cd AIBackend

# Create environment file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Install Python dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

The AI backend will run on `http://localhost:5001`

#### 4. Regular Backend Setup (Optional)

```bash
# Navigate to backend directory
cd Backend

# Install Python dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

The backend will run on `http://localhost:5000`

---

## 🔑 Environment Variables

### Frontend (.env.local)
```env
REACT_APP_FIREBASE_URL=https://your-firebase-project.firebaseio.com/Views.json
REACT_APP_FIREBASE_BUILT_URL=https://your-firebase-project.firebaseio.com/ResumesBuilt.json
```

### AI Backend (AIBackend/.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```


---

## 📖 How to Use

### 1. **Choose a Template**
   - Select from 6 professionally designed templates
   - Click "Next" to proceed

### 2. **Fill in Your Information**
   - Start with contact details
   - Add your skills, experience, projects, and education
   - Follow the guided step-by-step process
   - Get AI suggestions at each step

### 3. **Preview Your Resume**
   - See real-time preview as you fill in details
   - Switch templates instantly
   - Toggle dark/light mode

### 4. **Get AI Assistance**
   - Use ChatBot for questions
   - Get AI Analysis for feedback
   - Receive AI Suggestions for improvements
   - Use AI to generate professional descriptions

### 5. **Download Your Resume**
   - Export as PDF
   - Export as HTML
   - Download and use anywhere

---

## 🤖 AI Features

### Gemini AI Integration
The application uses Google's Gemini API to provide:

- **Resume Enhancement** - Improve content quality and formatting
- **Skill Suggestions** - Suggest relevant skills based on job title
- **Description Generation** - Create professional summaries
- **ATS Optimization** - Ensure keywords for Applicant Tracking Systems
- **Feedback & Analysis** - Detailed resume evaluation



---

## 👥 Development Team

### **Prashant Parshuramkar**
- **GitHub:** [PrashantPKP](https://github.com/PrashantPKP)
- **LinkedIn:** [Prashant Parshuramkar](https://www.linkedin.com/in/prashantparshuramkar9623/)
- **Portfolio:** [https://prashantparshuramkar.host20.uk/](https://prashantparshuramkar.host20.uk/)
- **Email:** [parshuramkarprashant64@gmail.com](mailto:parshuramkarprashant64@gmail.com)


---

## 📚 Skills & Technologies Supported

The resume builder supports hundreds of skills including:
- Programming Languages: Python, JavaScript, Java, C++, Go, Rust, TypeScript, etc.
- Frameworks: React, Vue, Angular, Django, Flask, FastAPI, Spring Boot, etc.
- Databases: MongoDB, PostgreSQL, MySQL, Redis, Cassandra, etc.
- Cloud Platforms: AWS, Azure, Google Cloud, Firebase, etc.
- DevOps & Tools: Docker, Kubernetes, Jenkins, GitHub Actions, Git, etc.
- And many more...


---

## 📄 License

This project is open-source and available under the MIT License.

---



## 📞 Support & Feedback

Have questions or feedback? Reach out :
- **Prashant:** [Email](mailto:prashantparshuramkar9146@gmail.com)

---

## 🎯 Roadmap

Future enhancements:
- [ ] More resume templates
- [ ] Multi-language support
- [ ] Cover letter builder
- [ ] Job matching algorithm
- [ ] Recruiter dashboard
- [ ] Advanced analytics
- [ ] Mobile app version

---
## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
**Made with ❤️ by Prashant Parshuramkar**

© 2026 All rights reserved | [Live Demo](https://resume.zapsas.info/)
---
