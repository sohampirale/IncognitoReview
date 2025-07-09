"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot } from 'lucide-react';
import axios from 'axios';
import {useRouter} from "next/nevigation"

const Chatbot = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText:string) => {
    if (!messageText.trim()) return;
    console.log('messageText = '+messageText);
    
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {

        
      const {data:response} = await axios.post('/api/ai/chat/cohere', {
        userMessage: messageText,
      });

      if (!response) {
        throw new Error('Failed to send message');
      }

      console.log('resposne received : '+JSON.stringify(response));
      
      if(response.data?.redirectUrl){
        console.log("redirecting...")
        setTimeout(()=>{
          router.push(response.data.redirectUrl)
        })
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response.message || "I'm sorry, I couldn't process your request at the moment.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      if(axios.isAxiosError(error)){
        console.error('Error sending message:', JSON.stringify(error!.response!.data));
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, there was an error processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
          >
            <Bot size={24} />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-medium">Chat</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

// "use client"
// import React, { useState, useRef, useEffect } from 'react';
// import { Send, X, Minimize2, Bot, Sparkles } from 'lucide-react';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your AI assistant. How can I help you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Default quick reply messages
//   const quickReplies = [
//     "How can I help you?",
//     "Tell me about your services",
//     "What are your business hours?",
//     "I need technical support",
//     "Can you provide pricing information?"
//   ];

//   // Scroll to bottom when new messages are added
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Handle sending message to AI endpoint
//   const sendMessage = async (messageText) => {
//     if (!messageText.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       text: messageText,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsTyping(true);

//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: messageText,
//           // Add any additional context or user info if needed
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send message');
//       }

//       const data = await response.json();
      
//       const botMessage = {
//         id: Date.now() + 1,
//         text: data.response || "I'm sorry, I couldn't process your request at the moment.",
//         sender: 'bot',
//         timestamp: new Date()
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
      
//       const errorMessage = {
//         id: Date.now() + 1,
//         text: "I'm sorry, there was an error processing your request. Please try again.",
//         sender: 'bot',
//         timestamp: new Date()
//       };

//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     sendMessage(inputMessage);
//   };

//   // Handle quick reply click
//   const handleQuickReply = (message) => {
//     setInputMessage(message);
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   return (
//     <>
//       {/* Floating Chat Button */}
//       <div 
//         className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
//           isOpen ? 'scale-0' : 'scale-100'
//         }`}
//       >
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
//         >
//           <div className="relative z-10">
//             <Bot size={28} className="group-hover:scale-110 transition-transform" />
//           </div>
//           {/* AI sparkle effect */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Sparkles size={16} className="text-yellow-300 animate-pulse absolute top-2 right-2" />
//           </div>
//           {/* Pulse animation */}
//           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-20"></div>
//         </button>
//       </div>

//       {/* Chat Window */}
//       {isOpen && (
//         <div 
//           className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl transition-all duration-300 ${
//             isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
//           }`}
//         >
//           {/* Chat Header */}
//           <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative">
//                 <Bot size={20} className="text-white" />
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-sm flex items-center gap-2">
//                   AI Assistant
//                   <Sparkles size={14} className="text-yellow-300" />
//                 </h3>
//                 <p className="text-xs text-blue-100">Online • Ready to help</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setIsMinimized(!isMinimized)}
//                 className="hover:bg-blue-500 hover:bg-opacity-50 p-2 rounded-lg transition-colors"
//               >
//                 <Minimize2 size={16} />
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="hover:bg-red-500 hover:bg-opacity-50 p-2 rounded-lg transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Chat Content */}
//           {!isMinimized && (
//             <>
//               {/* Messages Area */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-3 h-80">
//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex ${
//                       message.sender === 'user' ? 'justify-end' : 'justify-start'
//                     }`}
//                   >
//                     <div
//                       className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
//                         message.sender === 'user'
//                           ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
//                           : 'bg-gray-100 text-gray-800 border'
//                       }`}
//                     >
//                       <p className="text-sm">{message.text}</p>
//                       <p className={`text-xs mt-1 ${
//                         message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
//                       }`}>
//                         {formatTime(message.timestamp)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
                
//                 {/* Typing Indicator */}
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 px-4 py-2 rounded-lg">
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Quick Replies */}
//               <div className="px-4 py-2 border-t">
//                 <div className="flex flex-wrap gap-2">
//                   {quickReplies.map((reply, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleQuickReply(reply)}
//                       className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
//                     >
//                       {reply}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Input Area */}
//               <div className="p-4 border-t">
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     value={inputMessage}
//                     onChange={(e) => setInputMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
//                     placeholder="Type your message..."
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                   <button
//                     onClick={handleSubmit}
//                     disabled={!inputMessage.trim() || isTyping}
//                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
//                   >
//                     <Send size={16} />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Chatbot;