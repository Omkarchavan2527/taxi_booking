import Ride from '../models/Ride.js';
import Driver from '../models/Driver.js'; // Added so updateRideStatus doesn't crash
import { getIO } from '../services/Socket.js'; 

export const estimateRide = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropLat, dropLng } = req.body;
    
    // Mock distance calculation (in a real app, use OSRM or Haversine formula)
    const distanceMiles = Math.random() * 10 + 2; 
    
    // Base fares based on your master prompt
    const options = [
      { type: 'Economy', price: (distanceMiles * 1.5).toFixed(2), eta: '3 min' },
      { type: 'Premium', price: (distanceMiles * 2.5).toFixed(2), eta: '5 min' },
      { type: 'SUV', price: (distanceMiles * 3.5).toFixed(2), eta: '8 min' }
    ];

    res.json({ distance: distanceMiles.toFixed(1), options });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookRide = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, vehicleType, estimatedFare } = req.body;

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const ride = await Ride.create({
      user: req.user._id, // FIXED: MongoDB requires 'user'
      pickupLocation,
      dropLocation,
      vehicleType,
      estimatedFare,      // FIXED: MongoDB requires 'estimatedFare'
      otp,
      status: 'pending'
    });

    // Fire Socket.io event to alert nearby drivers!
    const io = getIO();
    io.emit('ride:new-request', { 
      rideId: ride._id, 
      pickupLocation, 
      dropLocation, 
      estimatedFare,
      vehicleType
    });

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP & Start Ride (Driver Action)
export const verifyOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const ride = await Ride.findById(id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update ride status
    ride.status = 'in_progress';
    ride.startTime = new Date();
    await ride.save();

    // Emit socket event so Rider UI updates instantly
    const io = getIO();
    io.emit('ride:started', { rideId: ride._id, startTime: ride.startTime });

    res.json({ success: true, message: 'Ride started successfully', ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Ride Status (e.g., arriving, completed)
export const updateRideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'arriving' or 'completed'

    const ride = await Ride.findById(id).populate('user driver');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.status = status;
    
    if (status === 'completed') {
      ride.endTime = new Date();
      // In a real app, you'd calculate exact fare based on GPS distance here.
      // For now, we lock in the estimated fare.
      ride.fare = ride.estimatedFare; 
      
      // Update Driver's total earnings and trips
      if (ride.driver && ride.driver._id) {
        const driver = await Driver.findById(ride.driver._id);
        if (driver) {
          driver.totalEarnings = (driver.totalEarnings || 0) + ride.fare;
          driver.totalRides = (driver.totalRides || 0) + 1;
          await driver.save();
        }
      }
    }

    await ride.save();

    // Alert the frontend
    const io = getIO();
    if (status === 'completed') {
      io.emit('ride:completed', { 
        rideId: ride._id, 
        fare: ride.fare,
        duration: Math.round((ride.endTime - ride.startTime) / 60000) // in minutes
      });
    }

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Rating & Review
export const rateRide = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.rating = rating;
    ride.review = review;
    await ride.save();

    // Update the Driver's overall average rating
    if (ride.driver) {
      const driver = await Driver.findById(ride.driver);
      if (driver) {
        const currentTotalStars = (driver.rating || 0) * (driver.totalRides || 0);
        driver.rating = Number(((currentTotalStars + rating) / ((driver.totalRides || 0) + 1)).toFixed(2));
        await driver.save();
      }
    }

    res.json({ success: true, message: 'Rating submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestRide = async (req, res) => {
  try {
    const { pickup, dropoff, vehicleType, estimatedFare } = req.body;

    // 1. Generate a random 4-digit OTP for security
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Create the Ride in MongoDB
    const newRide = await Ride.create({
      user: req.user._id,             // FIXED: MongoDB requires 'user'
      pickup,
      dropoff,
      vehicleType,
      estimatedFare: estimatedFare,   // FIXED: MongoDB requires 'estimatedFare'
      status: 'pending',
      otp: otp
    });

    // 3. Fire Socket.io event to alert nearby drivers
    const io = getIO();
    io.emit('ride:new-request', {
      rideId: newRide._id,
      pickup,
      dropoff,
      estimatedFare,
      vehicleType,
      user: {
        id: req.user._id,
        name: req.user.name || 'Passenger'
      }
    });

    // 4. Send success response back to Frontend
    res.status(201).json(newRide);

  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: 'Failed to create ride request' });
  }
};

export const getPendingRides = async (req, res) => {
  try {
    const pendingRides = await Ride.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.json(pendingRides);
  } catch (error) {
    console.error("Error fetching pending rides:", error);
    res.status(500).json({ message: 'Failed to load pending rides' });
  }
};

export const getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id).populate('driver', 'name vehicle rating phone').populate('user', 'name email phone rating avatar');
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json(ride);
  } catch (error) {
    console.error("Error fetching ride:", error);
    res.status(500).json({ message: 'Failed to fetch ride' });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the ride from the URL
    const driverId = req.user._id; // The logged-in driver's ID from your auth middleware

    // 1. Find the ride. Crucially, ensure it is still 'pending' so two drivers can't accept the same ride!
    const ride = await Ride.findOne({ _id: id, status: 'pending' });
    
    if (!ride) {
      return res.status(400).json({ message: 'Ride no longer available or already accepted.' });
    }

    // 2. Assign the driver and update the status
    ride.driver = driverId;
    ride.status = 'accepted';
    await ride.save();

    // 3. Populate driver and user info so both driver and rider have complete data
    await ride.populate('driver', 'name vehicle rating phone');
    await ride.populate('user', 'name email phone rating avatar');

    // 4. Alert the specific Rider that their driver is on the way via WebSockets!
    const io = getIO();
    io.emit(`ride:accepted:${ride._id}`, {
      message: "Driver found!",
      driver: ride.driver,
      eta: "3 mins" // In the future, calculate this using Google Maps Distance Matrix
    });

    res.json(ride);
  } catch (error) {
    console.error("Error accepting ride:", error);
    res.status(500).json({ message: error.message || 'Failed to accept ride' });
  }
};
