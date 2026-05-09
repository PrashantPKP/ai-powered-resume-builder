

import React, { useContext, useEffect } from "react";
import Typed from "typed.js"; 
import {Eye} from 'lucide-react';
import Examplepages from './Examplepage.jsx'
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from "./ThemeContext.jsx";
// import { MdDarkMode } from "react-icons/md";
import Switch from "./Switch.jsx";

const features = [
  "Create a professional resume in just 8 to 10 minutes — fast, stress-free, and efficient.",
  "Assistant Bot helps guide you through each step of the resume-building process.",
  "Choose from high-performing, ATS-optimized templates designed to get you hired.",
  "Preview your resume live as you enter information — complete transparency and control.",
  "Professionally designed layouts for every role, industry, and experience level.",
  "Your data is never saved or shared — full privacy and security ensured.",
  "Export your resume in multiple formats: PDF, HTML/CSS, and JSON database.",
  "Use auto-filled JSON to skip re-entering data on future visits — save time effortlessly.",
  "Get smart, real-time suggestions to improve your content as you type.",
  "Each section is structured using proven resume-writing practices backed by HR research.",
  "Browse and compare multiple templates instantly under the Generated Resumes section.",
  "Supports light/dark themes and responsive layout for all screen sizes."
];


const FrontPage=({views})=>{
  const navigate=useNavigate();

  const handleContinue=()=>{
    navigate('/FileUploadPage');
  };

  const handleViewTemplates=()=>{
    navigate('/ViewTemplates');
  };

  const handleAboutUs=()=>{
    navigate('/AboutUs');
  };

  const { isDark, setIsDark }=useContext(ThemeContext);

  const handleTheme=()=>{
    setIsDark((prev)=>!prev);
  };

  useEffect(()=>{
    const typedMobile=new Typed("#mobile-typing-text",{
      strings: features,
      loop: true,
      typeSpeed: 20,
      backSpeed: 15,
      backDelay: 900,
      cursorChar: " ",
    });

    const typed=new Typed("#desktop-typing-text",{
      strings: features,
      loop: true,
      typeSpeed: 20,
      backSpeed: 15,
      backDelay: 900,
      cursorChar: " "
    });

    return ()=>{
      typedMobile.destroy();
      typed.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 text-center px-4 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center w-full px-6 py-4 bg-white/90 backdrop-blur-xl shadow-xl rounded-3xl mt-4 dark:bg-slate-800/90 border border-gray-200/50 dark:border-slate-700/50 relative z-10">
        <div className="flex items-center gap-3">
          <button 
            className="mr-2 mt-1 transition-transform hover:scale-110"
            title="The Dark/Light mode will be chosen randomly on each refresh, allowing users to experience both modes. You can also set it as you prefer"
            onClick={handleTheme}>
              <Switch/>
          </button>
         
          <button
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl font-medium"
            onClick={handleViewTemplates}
            title="View Generated resume samples"
          >
            Generated Resumes
          </button>
        </div>
        
        <h1 className="text-2xl ml-10 font-bold no-underline flex items-center gap-2">
          <a href="#" title="AI-Powered Resume Builder" target="_blank" className="cursor-default flex items-center gap-2">
            <span className="text-1xl">✨</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
              AI-Powered Resume Builder
            </span>
          </a>
        </h1>
        <div className="flex space-x-3 items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl dark:text-gray-200 font-medium" title="Number of peoples Engaged here">
            <Eye className="w-5 h-5" />
            <span className="text-sm">{views}</span>
          </div>
          <button className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl font-medium" title="our contributions and contact information" onClick={handleAboutUs}>
            About Us
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold" title="Continue filling details and craft future jobs" onClick={handleContinue}>
            Continue ➤
          </button>
        </div>
      </div>

      {/* Desktop Hero Section */}
      <div className="hidden md:flex flex-col items-center justify-center mt-6 mb-12 relative z-10">
        <div className="mb-6 text-center max-w-4xl">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
            Level Up Your First Impression
          </h1>
          <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-full border-2 border-purple-300 dark:border-purple-600 inline-flex mx-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span className="text-2xl">🤖</span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">AI-Enhanced Resume Creation</span>
            <span className="text-2xl">✨</span>
          </div>
        </div>
        <Examplepages />    
        <div className="mt-6 mb-8 px-6 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200 dark:border-purple-700 min-h-[60px] flex items-center justify-center max-w-4xl hover:shadow-2xl transition-all duration-300">
          <span id="desktop-typing-text" className="hidden md:inline-block text-base md:text-lg text-gray-800 dark:text-white font-medium"></span>
        </div>
      </div>

      {/* Features Section - Desktop & Mobile */}
      <div className="relative z-10 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose Our Resume Builder?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge AI technology to help you land your dream job faster
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-purple-700">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Create a professional resume in just 8-10 minutes with our streamlined process</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-purple-700">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">AI-Powered Assistant</h3>
              <p className="text-gray-600 dark:text-gray-300">Get real-time suggestions and improvements from our intelligent AI assistant</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-purple-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">ATS-Optimized</h3>
              <p className="text-gray-600 dark:text-gray-300">Templates designed to pass Applicant Tracking Systems and get you noticed</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-purple-700">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Live Preview</h3>
              <p className="text-gray-600 dark:text-gray-300">See your resume update in real-time as you type - what you see is what you get</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-purple-700">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Privacy First</h3>
              <p className="text-gray-600 dark:text-gray-300">Your data is never saved or shared - complete privacy and security guaranteed</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-purple-700">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Multiple Formats</h3>
              <p className="text-gray-600 dark:text-gray-300">Export in PDF, HTML/CSS, and JSON - flexibility for all your needs</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl text-white text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Perfect Resume?</h3>
            <p className="text-lg mb-6 opacity-90">Join thousands of job seekers who've landed their dream jobs</p>
            <button 
              onClick={handleContinue}
              className="px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Get Started Now - It's Free! 🚀
            </button>
          </div>
        </div>
      </div>


      {/* Mobile View */}
      <div className="flex md:hidden justify-between items-center w-full px-6 py-3 bg-white/90 backdrop-blur-xl shadow-xl mt-6 rounded-3xl dark:bg-slate-800/90 border border-gray-200/50 dark:border-slate-700/50 relative z-10">
        <button 
          className="text-2xl mr-4 mt-1 transition-transform hover:scale-110"
          title="The Dark/Light mode will be chosen randomly on each refresh, allowing users to experience both modes. You can also set it to your preferred mode."
          onClick={handleTheme}>
            <Switch/>
        </button>

        <div className="md:hidden flex space-x-3">
          <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300 font-semibold" onClick={handleContinue}>
            Continue ➤
          </button>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <div className="md:hidden flex justify-center flex-col items-center py-8 px-4 relative z-10">
        <div className="mb-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 dark:text-white">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
              AI-Powered
            </span>
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 drop-shadow-md">
            Resume Builder
          </h2>
        </div>
        
        <div className="w-full max-w-md px-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl mb-6 border border-purple-200 dark:border-purple-700">
          <span id="mobile-typing-text" className="md:hidden text-sm sm:text-base text-gray-800 dark:text-white font-medium block min-h-[50px]"></span>
        </div>
        
        <button
          onClick={handleViewTemplates}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold mb-4 hover:scale-105"
        >
          View Generated Templates
        </button>
      </div>

      {/* Footer - Mobile */}
      <div className="md:hidden pb-8 font-bold text-gray-800 text-center dark:text-white/80 z-10 relative">
        <button
          onClick={handleAboutUs}
          className="cursor-pointer dark:text-gray-300 px-6 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-full hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl border border-purple-200 dark:border-purple-700"
        >
          About Us
        </button>
      </div>

      {/* <p className="text-sm sm:text-lg text-gray-500 font-semibold mb-4">       Here the desktop span are with mobile id
        <span id="mobile-typing-text" className="hidden md:inline-block text-xl md:text-2xl text-gray-800 h-6 mb-3 dark:text-white"></span>
      </p> */}
    </div>

  );
};

export default FrontPage;
