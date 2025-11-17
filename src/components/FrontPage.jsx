

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
    <div className="flex flex-col h-screen bg-white text-center px-4 dark:bg-slate-950">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center w-full px-6 py-4 bg-white/80 backdrop-blur-lg shadow-lg rounded-3xl mt-4 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50">
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
      <div className="hidden md:flex flex-col items-center justify-center flex-1 mt-6 mb-3">
        <div className="mb-6 text-center max-w-4xl">
          <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Level Up Your First Impression
          </h1>
          <div className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-full border border-purple-200 dark:border-purple-700 inline-flex mx-auto">
            <span className="text-xl">🤖</span>
            <span className="text-lg font-medium text-purple-700 dark:text-purple-300">AI-Enhanced Resume Creation</span>
            <span className="text-xl">✨</span>
          </div>
        </div>
        <Examplepages />    
        <div className="mt-6 mb-8 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center max-w-4xl">
          <span id="desktop-typing-text" className="hidden md:inline-block text-base md:text-lg text-gray-800 dark:text-white font-normal"></span>
        </div>
      </div>


      {/* Mobile View */}
      <div className="flex md:hidden justify-between items-center w-full px-6 py-3 bg-white/80 backdrop-blur-lg shadow-lg mt-6 rounded-3xl dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50">
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
      <div className="md:hidden flex justify-center flex-col items-center flex-grow px-4">
        <div className="mb-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 dark:text-white">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse">
              AI-Powered
            </span>
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Resume Builder
          </h2>
        </div>
        
        <div className="w-full max-w-md px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg mb-6">
          <span id="mobile-typing-text" className="md:hidden text-sm sm:text-base text-gray-800 dark:text-white font-normal block min-h-[50px]"></span>
        </div>
        
        <button
          onClick={handleViewTemplates}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-bold mb-4"
        >
          View Generated Templates
        </button>
      </div>

      <div className="md:hidden absolute bottom-6 font-bold text-gray-800 left-1/2 -translate-x-1/2 text-center dark:text-white/80">
        <button
          onClick={handleAboutUs}
          className="cursor-pointer dark:text-gray-300 px-6 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300"
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
