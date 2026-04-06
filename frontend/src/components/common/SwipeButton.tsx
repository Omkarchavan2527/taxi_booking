import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ChevronsRight } from 'lucide-react';

interface SwipeButtonProps {
  onComplete: () => void;
  text?: string;
}

export const SwipeButton: React.FC<SwipeButtonProps> = ({ 
  onComplete, 
  text = "Swipe to Start Ride" 
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCompleted) return;
    setIsDragging(true);
    startX.current = e.clientX - currentX.current;
    
    // Capture pointer to track outside the element
    if (thumbRef.current) {
      thumbRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isCompleted || !trackRef.current || !thumbRef.current) return;

    const trackWidth = trackRef.current.offsetWidth;
    const thumbWidth = thumbRef.current.offsetWidth;
    const maxX = trackWidth - thumbWidth - 8; // 8px padding

    let newX = e.clientX - startX.current;
    
    // Constrain movement
    if (newX < 0) newX = 0;
    if (newX > maxX) newX = maxX;

    currentX.current = newX;
    
    // Apply visual update immediately without GSAP for zero latency tracking
    thumbRef.current.style.transform = `translateX(${newX}px)`;
    
    // Fade out text based on drag percentage
    if (textRef.current) {
      const opacity = 1 - (newX / (maxX * 0.8));
      textRef.current.style.opacity = Math.max(0, opacity).toString();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isCompleted || !trackRef.current || !thumbRef.current) return;
    setIsDragging(false);
    
    if (thumbRef.current) {
      thumbRef.current.releasePointerCapture(e.pointerId);
    }

    const trackWidth = trackRef.current.offsetWidth;
    const thumbWidth = thumbRef.current.offsetWidth;
    const maxX = trackWidth - thumbWidth - 8;

    // Check if dragged past 80% threshold
    if (currentX.current > maxX * 0.8) {
      setIsCompleted(true);
      // GSAP: Animate to end and trigger completion
      gsap.to(thumbRef.current, {
        x: maxX,
        duration: 0.3,
        ease: 'power3.out',
        onComplete: onComplete
      });
    } else {
      // GSAP: Snap back to start if not dragged far enough
      currentX.current = 0;
      gsap.to(thumbRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'back.out(1.2)'
      });
      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
      }
    }
  };

  return (
    <div 
      ref={trackRef}
      className={`relative w-full h-14 rounded-2xl flex items-center p-1 overflow-hidden transition-colors duration-300 select-none touch-none ${
        isCompleted ? 'bg-green-500' : 'bg-primary'
      }`}
    >
      {/* Background Text */}
      <div 
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-white font-bold tracking-wide flex items-center">
          {text} 
          <ChevronsRight size={20} className="ml-2 animate-pulse" />
        </span>
      </div>

      {/* Draggable Thumb */}
      <div 
        ref={thumbRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        style={{ touchAction: 'none' }}
      >
        {isCompleted ? (
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        ) : (
          <ChevronsRight size={24} className="text-primary" />
        )}
      </div>
    </div>
  );
};