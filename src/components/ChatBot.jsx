import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ChatBot = ({ isOpen, onToggle, currentSection = 'general', userData = {} }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI resume assistant. I'm here to help you create an amazing resume. What would you like to know about resume writing?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Enhanced context with user data
      const contextualUserData = {
        ...userData,
        currentSection: currentSection,
        hasJobTitle: Boolean(userData.jobTitle && userData.jobTitle !== 'Professional'),
        hasSkills: Boolean(userData.skills && userData.skills.length > 10),
        hasExperience: Boolean(userData.experience && userData.experience.length > 0 && userData.experience[0].jobTitle),
        hasEducation: Boolean(userData.education && userData.education.length > 0 && userData.education[0].institutionName),
        completionLevel: calculateFormCompletion()
      };

      const response = await fetch('http://localhost:5001/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          section: currentSection,
          userData: contextualUserData,
          history: messages.slice(-5) // Send last 5 messages for context
        })
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: cleanMarkdownText(data.response),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please make sure the AI backend is running on port 5001, or try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  // Calculate form completion for better context
  const calculateFormCompletion = () => {
    const formData = userData.formData || {};
    let completed = 0;
    let total = 7;

    if (formData.contactInfo?.fullName) completed++;
    if (formData.contactInfo?.jobTitle) completed++;
    if (formData.skills?.hardSkills) completed++;
    if (formData.workExperience?.[0]?.jobTitle) completed++;
    if (formData.projects?.[0]?.projectTitle) completed++;
    if (formData.education?.[0]?.institutionName) completed++;
    if (formData.Description?.UserDescription) completed++;

    return Math.round((completed / total) * 100);
  };

  // Clean markdown symbols from AI responses
  const cleanMarkdownText = (text) => {
    if (!text) return text;
    
    return text
      // Remove bold markers
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      // Remove italic markers
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove code markers
      .replace(/`(.*?)`/g, '$1')
      // Remove header markers
      .replace(/#{1,6}\s*/g, '')
      // Remove list markers but keep the content
      .replace(/^\s*[-*+]\s+/gm, '• ')
      // Remove numbered list markers
      .replace(/^\s*\d+\.\s+/gm, '• ')
      // Clean up extra spaces and newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Give me a professional summary sample",
    "What skills should I include?", 
    "How to describe achievements with numbers?",
    "ATS-friendly keywords for my role",
    "How to make my experience sound impressive?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">AI Resume Assistant</h3>
                  <p className="text-xs opacity-90">
                    {currentSection !== 'general' ? `Helping with: ${currentSection}` : 'Ready to help!'}
                  </p>
                </div>
              </div>
              <Sparkles className="w-5 h-5 opacity-80" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Bot className="w-4 h-4 mt-1 opacity-70" />
                      )}
                      {message.type === 'user' && (
                        <User className="w-4 h-4 mt-1 opacity-70" />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 opacity-70" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <HelpCircle className="w-3 h-3 mr-1" />
                    Quick questions:
                  </p>
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about resume writing..."
                  rows={1}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none text-sm"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;