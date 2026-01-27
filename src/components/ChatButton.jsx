import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatButton = ({ onClick, hasNewMessage = false }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center animate-fade-in"
      aria-label="Open chat"
    >
      <MessageCircle size={24} />
      
      {/* Notification dot for new messages */}
      {hasNewMessage && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      )}
    </button>
  );
};

export default ChatButton;