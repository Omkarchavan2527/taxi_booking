import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

interface OTPVerifyProps {
  onVerify: (otp: string) => void;
  error?: string | null;
}

export const OTPVerify: React.FC<OTPVerifyProps> = ({ onVerify, error }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP: Shake animation if there's an error
  useEffect(() => {
    if (error && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { x: -10 }, 
        { x: 10, clearProps: "x", duration: 0.1, repeat: 3, yoyo: true }
      );
    }
  }, [error]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    // Only allow numbers
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input automatically
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length === 4) {
      onVerify(code);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-float max-w-sm w-full mx-auto border border-gray-100 text-center" ref={containerRef}>
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
        <ShieldCheck size={32} />
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Ride</h2>
      <p className="text-sm text-gray-500 mb-6">
        Ask the passenger for their 4-digit PIN to start the journey.
      </p>

      <div className="flex justify-center gap-3 mb-6">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            className="w-14 h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        ))}
      </div>

      {error && <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-4">{error}</p>}

      <Button 
        fullWidth 
        onClick={handleSubmit} 
        disabled={otp.join('').length !== 4}
        className="py-4 rounded-2xl text-lg disabled:opacity-50 disabled:active:scale-100"
      >
        Start Trip
      </Button>
    </div>
  );
};