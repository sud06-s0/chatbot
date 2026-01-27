import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import Message from './Message';

const ChatWindow = ({ onClose, initialMessage, intentType, onSendMessage }) => {
  const [messages, setMessages] = useState([
    { text: initialMessage, isBot: true, buttons: null }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle button click
  const handleButtonClick = async (buttonLabel) => {
    // Add user message
    setMessages(prev => [...prev, { text: buttonLabel, isBot: false }]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Send to backend
    const response = await onSendMessage(buttonLabel, true);
    
    setIsTyping(false);
    
    // Add bot response
    if (response) {
      setMessages(prev => [...prev, {
        text: response.message,
        isBot: true,
        buttons: response.buttons || null
      }]);
    }
  };

  // Handle text input send
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Send to backend
    const response = await onSendMessage(userMessage, false);
    
    setIsTyping(false);
    
    // Add bot response
    if (response) {
      setMessages(prev => [...prev, {
        text: response.message,
        isBot: true,
        buttons: response.buttons || null
      }]);
    }
  };

  // Get contextual buttons based on intent
  const getInitialButtons = () => {
    if (intentType === 'pricing') {
      return [
        { label: 'Bulk orders', onClick: () => handleButtonClick('Bulk orders') },
        { label: 'Standard pricing', onClick: () => handleButtonClick('Standard pricing') },
        { label: 'Talk to sales', onClick: () => handleButtonClick('Talk to sales') }
      ];
    }
    if (intentType === 'technical') {
      return [
        { label: 'Product specs', onClick: () => handleButtonClick('Product specs') },
        { label: 'Integration help', onClick: () => handleButtonClick('Integration help') },
        { label: 'Documentation', onClick: () => handleButtonClick('Documentation') }
      ];
    }
    if (intentType === 'evaluation') {
      return [
        { label: 'Request demo', onClick: () => handleButtonClick('Request demo') },
        { label: 'Compare options', onClick: () => handleButtonClick('Compare options') },
        { label: 'See case studies', onClick: () => handleButtonClick('See case studies') }
      ];
    }
    return [
      { label: 'Learn more', onClick: () => handleButtonClick('Learn more') },
      { label: 'Talk to someone', onClick: () => handleButtonClick('Talk to someone') }
    ];
  };

  // Add buttons to first message
  useEffect(() => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated[0]) {
        updated[0].buttons = getInitialButtons();
      }
      return updated;
    });
  }, []);

  return (
    <div className="w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium">Chat</h3>
        <button
          onClick={onClose}
          className="hover:bg-blue-600 rounded p-1 transition-colors"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={msg.text}
            isBot={msg.isBot}
            buttons={msg.buttons?.map(btn => ({
              label: btn.label,
              onClick: btn.onClick
            }))}
          />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="text-left mb-4">
            <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;