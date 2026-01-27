import React from 'react';

const Message = ({ message, isBot, buttons }) => {
  return (
    <div className={`mb-4 ${isBot ? 'text-left' : 'text-right'}`}>
      <div
        className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
          isBot
            ? 'bg-gray-100 text-gray-800'
            : 'bg-primary text-white'
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      
      {/* Button options (only for bot messages) */}
      {isBot && buttons && buttons.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => button.onClick()}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;