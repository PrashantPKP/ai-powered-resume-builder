
import React from 'react';
import resumeIcon from '../assets/resume-icon.png';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-black">
      <img
        src={resumeIcon}
        alt="Wait a while 😐"
        title='Wait a while 😐. Content is loading'
        className="w-15 h-15 animate-step-rotate"
      />
    </div>
  );
};

export default Loader;