import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";

const developers = [
  {
    name: "Prashant Parshuramkar",
    role: "Full Stack Developer & AI Integration Specialist",
    initials: "PP",
    description: "Built the Flask backend with dual API architecture for AI enhancement and resume parsing. Integrated Google Gemini AI with rotating API keys for intelligent resume analysis and suggestions. Developed multi-format export functionality (PDF, HTML, JSON) and implemented the chatbot system for user assistance.",
    github: "PrashantPKP",
    gitLink: "https://github.com/PrashantPKP",
    linkedin: "prashantpkp",
    linLink: "https://www.linkedin.com/in/prashantpkp/",
    portfolio: "Prashant-Parshuramkar",
    prtLink: "https://prashantparshuramkar.host20.uk/",
    email: "Prashant-Parshuramkar",
    emailLink: "mailto:parshuramkarprashant64@gmail.com"
  },
  {
    name: "Umeruddin Inamdar",
    role: "Frontend Developer & UI/UX Designer",
    initials: "UI",
    description: "Architected and developed all 6 professional resume templates with responsive designs. Implemented the complete frontend using React, styled-components, and Framer Motion. Created interactive UI components including the preview system, theme switcher, and dynamic form builder with real-time validation.",
    github: "Umeruddin78",
    gitLink: "https://github.com/Umeruddin78",
    linkedin: "Umeruddin-inamdar-357632233",
    linLink: "https://www.linkedin.com/in/umeruddin-inamdar-357632233/",
    portfolio: "Umeruddin-Inamdar",
    prtLink: "https://umeruddininamdar.host20.uk/",
    email: "Umeruddin-Inamdar",
    emailLink: "mailto:umeroddin.inamdar14@gmail.com"
  },
];

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 md:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Meet Our Team
        </h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          The creative minds behind this AI-powered resume builder
        </p>
      </motion.div>

      {/* Developer Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {developers.map((dev, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-yellow-400 shadow-2xl overflow-hidden bg-white flex items-center justify-center"
              >
                <span className="text-5xl font-bold text-blue-600">{dev.initials}</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">{dev.name}</h2>
              <p className="text-blue-100 font-medium text-lg">{dev.role}</p>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                {dev.description}
              </p>

              {/* Social Links */}
              <div className="space-y-3">
                <motion.a
                  whileHover={{ scale: 1.02, x: 5 }}
                  href={dev.gitLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                    <FaGithub className="text-white text-xl" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    github.com/{dev.github}
                  </span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02, x: 5 }}
                  href={dev.linLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    <FaLinkedin className="text-white text-xl" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    linkedin.com/in/{dev.linkedin}
                  </span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02, x: 5 }}
                  href={dev.prtLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-purple-50 dark:hover:bg-slate-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                    <FaGlobe className="text-white text-xl" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {dev.portfolio}
                  </span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02, x: 5 }}
                  href={dev.emailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-pink-50 dark:hover:bg-slate-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center group-hover:bg-pink-700 transition-colors">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                    {dev.email}
                  </span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-16"
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          © 2026 AI Resume Builder. Built with ❤️ by{" "}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Prashant Parshuramkar
          </span>
          {" & "}
          <span className="text-purple-600 dark:text-purple-400 font-medium">
            Umeruddin Inamdar
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default AboutUs;
