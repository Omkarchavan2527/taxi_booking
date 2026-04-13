import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';

export const LoginPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState('rider@swift-ride.com');
  const [password, setPassword] = useState('kinetic');
  // We will connect this to your actual API later
  const { loginUser, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
    // GSAP: card slides up on mount
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginUser({ email, password });
      
      const state = useAuthStore.getState();
      const userRole = state.user?.role;
      
      console.log("Login Success. Role:", userRole);

      // --- MATCHING THE APP.TSX PATHS ---
      if (userRole === 'driver') {
        navigate('/driver/dashboard');
      } else {
        // Changed from /dashboard to /rider/home to match App.tsx
        navigate('/rider/home');
      }
    } catch (err) {
      console.error("Login attempt failed");
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" 
         style={{ background: 'radial-gradient(circle at center, #1e2a3a 0%, #0a0e1a 100%)' }}>
      
      {/* Decorative Background Photo would go here as an absolute div */}
      
      <div 
        ref={cardRef}
        className="auth-card w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-float border border-white/20 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SwiftRide</h1>
          <p className="uppercase tracking-[0.15em] text-[10px] text-gray-500 mt-1 font-medium">
            The Kinetic Curator
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please enter your details to continue your journey.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50/80 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input 
            label="Email or Phone" 
            type="text" 
            placeholder="Enter your email"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                Forgot?
              </Link>
            }
          />

          <Button type="submit" fullWidth className="mt-6 rounded-2xl text-base py-4" disabled={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="flex gap-4">
          <Button variant="social" fullWidth>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </Button>
          <Button variant="social" fullWidth>
            <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 mr-2" />
            Apple
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Join the Kinetic club
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-gray-600">Terms</Link>
          <span>·</span>
          <Link to="/accessibility" className="hover:text-gray-600">Accessibility</Link>
        </div>
      </div>
    </div>
  );
};
