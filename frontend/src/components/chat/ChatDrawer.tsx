import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Send } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string; // e.g., "Alex Driver" or "Sarah J."
  partnerRole: 'Driver' | 'Rider';
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, partnerName, partnerRole }) => {
  const [inputText, setInputText] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Mock initial messages
  const [messages, setMessages] = useState([
    { id: 1, content: "Hi, I'm waiting outside the lobby.", time: "2:45 PM", isOwnMessage: false },
    { id: 2, content: "Great, I'll be right out!", time: "2:46 PM", isOwnMessage: true }
  ]);

  useEffect(() => {
    if (isOpen) {
      // Slide up
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
      gsap.fromTo(drawerRef.current, 
        { y: '100%' }, 
        { y: '0%', duration: 0.4, ease: 'power3.out' }
      );
    } else if (drawerRef.current) {
      // Slide down
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
      gsap.to(drawerRef.current, { y: '100%', duration: 0.3, ease: 'power3.in' });
    }
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwnMessage: true
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Here you would trigger your socket event:
    // socket.emit('chat:send-message', { rideId: '123', content: inputText });
  };

  return (
    <>
      {/* Dark Overlay */}
      <div 
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[500] hidden"
      ></div>

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="fixed bottom-0 left-0 right-0 h-[75vh] md:h-[60vh] max-w-2xl mx-auto bg-gray-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[510] flex flex-col overflow-hidden"
        style={{ transform: 'translateY(100%)' }}
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm z-10">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{partnerName}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{partnerRole}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col">
          <div className="text-center mb-6">
            <span className="text-[9px] font-bold text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full uppercase tracking-widest">
              Today
            </span>
          </div>
          
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              content={msg.content} 
              time={msg.time} 
              isOwnMessage={msg.isOwnMessage} 
            />
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};