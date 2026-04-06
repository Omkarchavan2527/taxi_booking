import React from 'react';

interface MessageBubbleProps {
  content: string;
  time: string;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ content, time, isOwnMessage }) => {
  return (
    <div className={`flex w-full mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
            isOwnMessage 
              ? 'bg-primary text-white rounded-br-none' 
              : 'bg-white border border-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          {content}
        </div>
        <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest px-1">
          {time}
        </span>
      </div>
    </div>
  );
};