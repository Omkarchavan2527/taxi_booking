import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Mail, Lock, User, UploadCloud, Car, Zap, Star } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';

type Role = 'rider' | 'driver';
type VehicleType = 'STANDARD' | 'ELECTRIC' | 'PREMIUM XL';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<Role>('rider');
  const [vehicleType, setVehicleType] = useState<VehicleType>('STANDARD');
  const driverSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 1. Setup local state for all inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    vehicleModel: '',
    plateNumber: ''
  });

  // 2. Connect to useAuthStore
  const { registerUser, isLoading, error, clearError } = useAuthStore();

  // GSAP: Animate driver section in/out
  useEffect(() => {
    if (!driverSectionRef.current) return;
    
    if (role === 'driver') {
      gsap.to(driverSectionRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        display: 'block'
      });
    } else {
      gsap.to(driverSectionRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        display: 'none'
      });
    }
    clearError(); // Clear errors when switching roles
  }, [role, clearError]);

  // 3. Updated Registration Logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      // Only include vehicle data if registering as a driver
      ...(role === 'driver' && {
        vehicle: {
          make: formData.vehicleModel.split(' ')[0] || 'Unknown',
          model: formData.vehicleModel,
          licensePlate: formData.plateNumber,
          type: vehicleType
        }
      })
    };

    try {
      await registerUser(payload);
      
      // Get state after async call
      const state = useAuthStore.getState();
      
      if (state.isAuthenticated) {
        if (role === 'driver') {
          navigate('/driver/dashboard');
        } else {
          // Matches your App.tsx path="/rider/home"
          navigate('/rider/home');
        }
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      
      {/* Left 60%: Form Area */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SwiftRide</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start your journey</h2>
            <p className="text-gray-500 text-sm">Join the movement. Choose how you want to move today.</p>
          </div>

          {/* Show Error Message if registration fails */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          {/* Role Toggle Pill */}
          <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
            <button
              type="button"
              onClick={() => setRole('rider')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === 'rider' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rider
            </button>
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === 'driver' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Driver
            </button>
          </div>

          <form onSubmit={handleRegister}>
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="e.g. Alex Johnson"
              icon={<User size={18} />}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
              <div className="flex-1">
                <Input 
                  label="Email" 
                  type="email" 
                  placeholder="Enter email"
                  icon={<Mail size={18} />}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="flex-1">
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Hidden Driver Section */}
            <div 
              ref={driverSectionRef} 
              className="overflow-hidden opacity-0 hidden"
              style={{ height: 0 }}
            >
              <div className="pt-4 pb-2 border-t border-gray-100 mt-2 mb-4">
                <h3 className="flex items-center text-primary font-bold mb-4">
                  <Car size={20} className="mr-2" /> Partner Details
                </h3>

                <div className="mb-5">
                  <label className="uppercase tracking-[0.08em] text-xs text-gray-500 font-semibold block mb-2">
                    Driving License
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-primary/50 transition-colors cursor-pointer">
                    <UploadCloud size={28} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF or JPG (Max 5MB)</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 mb-2">
                  <div className="flex-1">
                    <Input 
                      label="Vehicle Model" 
                      type="text" 
                      placeholder="e.g. Toyota Prius" 
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                    />
                  </div>
                  <div className="flex-1">
                    <Input 
                      label="Plate Number" 
                      type="text" 
                      placeholder="e.g. ABC-1234" 
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="uppercase tracking-[0.08em] text-xs text-gray-500 font-semibold block mb-2">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'STANDARD', icon: <Car size={20}/> },
                      { type: 'ELECTRIC', icon: <Zap size={20}/> },
                      { type: 'PREMIUM XL', icon: <Star size={20}/> }
                    ].map((v) => (
                      <div 
                        key={v.type}
                        onClick={() => setVehicleType(v.type as VehicleType)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                          vehicleType === v.type 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {v.icon}
                        <span className="text-[10px] font-bold mt-2 text-center leading-tight">
                          {v.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              className="mt-4 rounded-2xl py-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account →'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right 40%: Decorative Dark Mockup */}
      <div className="hidden lg:flex w-[40%] bg-[#0F1117] relative items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="relative w-[300px] h-[620px] bg-[#1A1D27] rounded-[3rem] border-[10px] border-[#2A2D3A] shadow-2xl overflow-hidden z-10 flex flex-col">
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center">
            <div className="w-32 h-6 bg-[#0F1117] rounded-b-3xl"></div>
          </div>
          <div className="flex-1 bg-gray-900 relative">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 150 Q 150 200, 100 350 T 250 500" fill="transparent" stroke="#2563EB" strokeWidth="6" strokeDasharray="10, 10" className="animate-pulse" />
              <circle cx="50" cy="150" r="8" fill="#2563EB" />
              <circle cx="250" cy="500" r="8" fill="#22C55E" />
            </svg>
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-[#0F1117] rounded-t-3xl border-t border-[#2A2D3A] p-5">
               <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-4"></div>
               <div className="h-4 bg-gray-800 rounded w-1/2 mb-3"></div>
               <div className="h-10 bg-gray-800 rounded-xl w-full mb-3"></div>
               <div className="h-12 bg-primary rounded-xl w-full mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};