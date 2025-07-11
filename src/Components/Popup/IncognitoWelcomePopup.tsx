"use client"
import React, { useState, useEffect } from 'react';
import { X, Github, ExternalLink, Zap, Shield, BarChart3, Bot, Play } from 'lucide-react';

const IncognitoWelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate checking if user is new (in real app, check localStorage or user session)
  useEffect(() => {
    const hasVisited = false; // Replace with actual check: localStorage.getItem('hasVisitedIncognito')
    if (!hasVisited) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // In real app: localStorage.setItem('hasVisitedIncognito', 'true')
  };

  const features = [
    {
      icon: <Shield className="w-5 h-5 text-green-400" />,
      title: "100% Anonymous",
      description: "Complete anonymity for honest feedback"
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
      title: "AI-Powered Insights",
      description: "Get intelligent reports on your feedback"
    },
    {
      icon: <Bot className="w-5 h-5 text-purple-400" />,
      title: "Smart Action Bot",
      description: "Natural language topic creation"
    }
  ];

  const steps = [
    "Create a topic for feedback",
    "Share your unique link",
    "Receive anonymous responses",
    "Get AI-generated insights"
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
        {/* Header with close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative p-4 sm:p-6 lg:p-8">
          {/* Logo and title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Incognito Feedback</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">
              Collect honest, anonymous feedback with AI-powered insights
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                <div className="flex items-center mb-2">
                  {feature.icon}
                  <h3 className="text-white font-semibold ml-2 text-sm sm:text-base">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              How it works
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm mb-2 mx-auto">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Creator info */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 sm:p-6 border border-gray-600/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Created by Soham Pirale</h3>
                <p className="text-gray-400 text-sm">Full-stack Developer</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                SP
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              Built with Next.js, featuring custom backend logic and AI-enhanced frontend design. 
              Inspired by modern feedback systems and powered by intelligent automation.
            </p>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href="https://github.com/sohampirale"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                GitHub Profile
              </a>
              <a
                href="https://github.com/sohampirale/IncognitoReview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                View Source
              </a>
              <a
                href="https://youtu.be/zLJoVRleOuc?si=9LoG69njstg_G856"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Original Inspiration
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={handleClose}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Get Started
            </button>
            <p className="text-gray-400 text-xs mt-2">This popup shows only once for new users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncognitoWelcomePopup;