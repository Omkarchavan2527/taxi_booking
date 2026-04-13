import React, { useEffect, useState } from 'react';
import { X, CreditCard, Banknote } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { DarkMapView } from '../../components/map/DarkMapView';
import { ActiveRideCard } from '../../components/booking/ActiveRideCard';
import { useRideStore } from '../../store/useRideStore';

// 1. Initialize Socket Connection
const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

export const ActiveRidePage: React.FC = () => {
  const navigate = useNavigate();
  const { rideId } = useParams(); // Grabs the ID from the URL (e.g. /rider/active/123)
  const { currentRide, clearRide, fetchRide } = useRideStore();
  
  // 2. Local state to store the driver info once they accept
  const [driverData, setDriverData] = useState<any>(null);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);
  
  // Payment state
  const [isPaymentDue, setIsPaymentDue] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    // Use either the URL param or the store ID
    const targetId = rideId || currentRide?._id;
    if (!targetId) return;

    console.log("Listening for driver acceptance on ride:", targetId);

    // Listen for the specific 'ride:accepted' event for THIS ride
    const acceptedEventName = `ride:accepted:${targetId}`;
    socket.on(acceptedEventName, (data) => {
      console.log("MATCH FOUND! Driver Details:", data.driver);
      setRideConfirmed(true); // Show confirmation first
      setTimeout(() => {
        setDriverData(data.driver); // Then show driver details after a brief delay
      }, 800);
    });

    // Listen for ride completion to instantly trigger payment due
    socket.on('ride:completed', (data) => {
      if (data.rideId === targetId) {
        console.log("SOCKET: Ride completed, payment due!");
        setIsPaymentDue(true);
      }
    });

    return () => {
      socket.off(acceptedEventName);
      socket.off('ride:completed');
    };
  }, [rideId, currentRide?._id]);

  // Fetch ride periodically to check for completion
  useEffect(() => {
    const targetId = rideId || currentRide?._id;
    if (!targetId || isPaymentDue) return;

    const pollRide = async () => {
      try {
        const ride = await fetchRide(targetId);
        if (ride && ride.status === 'completed') {
          console.log("Ride completed, payment due!");
          setIsPaymentDue(true);
        }
      } catch (error) {
        console.error("Error polling ride status:", error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollRide, 5000);
    
    // Also fetch immediately on mount
    pollRide();

    return () => clearInterval(interval);
  }, [rideId, currentRide?._id, fetchRide, isPaymentDue]);

  useEffect(() => {
    if (driverData || rideConfirmed) {
      setShowNotifyMessage(false);
      setTimeLeft(0);
      return;
    }

    setTimeLeft(60);
    setShowNotifyMessage(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowNotifyMessage(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [driverData, rideConfirmed]);

  const handlePayment = (method: 'cash' | 'online') => {
    setPaymentProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setPaymentProcessing(false);
      clearRide();
      navigate('/rider/home');
    }, 2000);
  };

  // Derived state to handle page refreshes
  const activeDriver = driverData || currentRide?.driver;
  const isRideConfirmed = rideConfirmed || !!activeDriver || currentRide?.status === 'accepted' || currentRide?.status === 'in_progress';

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-gray-900">
      
      {/* Dark Map Layer */}
      <DarkMapView 
        pickup={currentRide?.pickup?.lat ? [currentRide.pickup.lat, currentRide.pickup.lng] : undefined}
        dropoff={currentRide?.dropoff?.lat ? [currentRide.dropoff.lat, currentRide.dropoff.lng] : undefined}
      />

      {/* Payment Popup Overlay */}
      {isPaymentDue && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Destination Reached!</h2>
              <p className="text-gray-500 text-sm">Please settle the payment to complete your trip.</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex flex-col items-center border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Fare</p>
              <p className="text-4xl font-bold text-gray-900">${currentRide?.estimatedFare || '24.50'}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handlePayment('online')}
                disabled={paymentProcessing}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors hover:bg-blue-700 disabled:opacity-70"
              >
                {paymentProcessing ? 'Processing...' : (
                  <>
                    <CreditCard size={20} />
                    Pay Online
                  </>
                )}
              </button>
              <button 
                onClick={() => handlePayment('cash')}
                disabled={paymentProcessing}
                className="w-full bg-white text-gray-900 border border-gray-200 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors hover:bg-gray-50 disabled:opacity-70"
              >
                <Banknote size={20} className="text-green-600" />
                Pay with Cash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none p-4 md:p-6">
        
        {/* Top Header Layer */}
        <div className="flex justify-between items-start pointer-events-none">
          <div className="bg-white rounded-xl px-4 py-3 shadow-md pointer-events-auto flex items-center border border-gray-100">
            <div className={`w-2 h-2 rounded-full ${activeDriver ? 'bg-green-500' : isRideConfirmed ? 'bg-yellow-500' : 'bg-primary animate-pulse'} mr-3`}></div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-sm font-bold text-gray-900 leading-none">
                {activeDriver ? 'Driver Arriving' : isRideConfirmed ? 'Booking Confirmed! 🎉' : 'Finding Driver'}
              </p>
              {!activeDriver && !isRideConfirmed && (
                <p className="text-[10px] text-gray-500 mt-1">Searching for a match... {timeLeft}s</p>
              )}
              {isRideConfirmed && !activeDriver && (
                <p className="text-[10px] text-yellow-600 mt-1">Driver details loading...</p>
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate('/rider/home')}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-900 shadow-md hover:bg-gray-50 transition-colors pointer-events-auto"
          >
            <X size={24} />
          </button>
        </div>

        {/* 4. PASS THE REAL DRIVER DATA TO THE CARD */}
        {showNotifyMessage && !activeDriver && !isPaymentDue && (
          <div className="mb-4 rounded-3xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 shadow-sm pointer-events-auto">
            <p className="font-semibold">Still searching for a driver...</p>
            <p className="text-sm text-yellow-900/90 mt-1">
              We haven't matched your ride yet. If a driver accepts, we’ll notify you immediately.
            </p>
          </div>
        )}
        
        {!isPaymentDue && (
          <div className="pointer-events-auto">
             <ActiveRideCard driver={activeDriver} isConfirmed={isRideConfirmed} otp={currentRide?.otp} />
          </div>
        )}

      </div>
    </div>
  );
};
