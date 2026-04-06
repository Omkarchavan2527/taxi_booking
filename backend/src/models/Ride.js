import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema(
  {
    // The passenger booking the ride
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    // The driver who accepts it (initially null)
    driver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Driver' 
    },
    pickup: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoff: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    estimatedFare: { 
      type: Number, 
      required: true 
    },
    fare: { 
      type: Number 
    },
    // The 4-digit code generated for the driver to start the trip
    otp: { 
      type: String, 
      required: true 
    },
    startTime: { 
      type: Date 
    },
    endTime: { 
      type: Date 
    },
    rating: { 
      type: Number,
      min: 1,
      max: 5
    },
    review: { 
      type: String 
    },
  },
  { 
    timestamps: true 
  }
);

const Ride = mongoose.model('Ride', rideSchema);

// This ensures your rideController.js can import it!
export default Ride;