import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface RatingModalProps {
  targetName: string; // e.g., "Alex Driver" or "Sarah J."
  targetAvatar: string;
  fare: string;
  onSubmit: (rating: number, review: string) => void;
  onSkip: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ 
  targetName, 
  targetAvatar, 
  fare, 
  onSubmit, 
  onSkip 
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP: Spring scale up on mount
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(rating, review);
    }, 1500); // Give user time to see the "Thank you" state before unmounting
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md text-center relative overflow-hidden"
      >
        {!submitted ? (
          <>
            <p className="text-[10px] font-bold text-driver bg-driver/10 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-6">
              Trip Completed
            </p>
            
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{fare}</h2>
            <p className="text-sm text-gray-500 font-medium mb-8">Payment successful via Card</p>

            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-gray-50 shadow-sm mb-4">
              <img src={targetAvatar} alt={targetName} className="w-full h-full object-cover" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-1">How was your trip with {targetName}?</h3>
            <p className="text-xs text-gray-400 mb-6">Your feedback helps us improve the Kinetic experience.</p>

            {/* Interactive Stars */}
            <div className="flex justify-center gap-2 mb-6 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={40}
                  className={`transition-all duration-200 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-200 fill-transparent'}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            {/* Optional Review Box */}
            <div className={`transition-all duration-300 overflow-hidden ${rating > 0 ? 'h-24 opacity-100 mb-6' : 'h-0 opacity-0 mb-0'}`}>
              <textarea 
                placeholder="Leave a compliment or feedback (optional)"
                className="w-full h-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-3">
              <Button onClick={onSkip} variant="social" className="w-1/3 rounded-xl border-none text-gray-500 font-bold bg-gray-50 hover:bg-gray-100">
                Skip
              </Button>
              <Button onClick={handleSubmit} disabled={rating === 0} className="w-2/3 rounded-xl py-4 disabled:opacity-50">
                Submit Feedback
              </Button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-500 text-sm">Your feedback has been recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};