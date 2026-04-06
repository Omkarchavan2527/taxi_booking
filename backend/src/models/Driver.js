import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    // Link to the main User account (for email, password, name, etc.)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One user can only have one driver profile
    },
    // Vehicle Information
    vehicle: {
      make: { type: String, required: true, default: 'Toyota' },
      model: { type: String, required: true, default: 'Prius' },
      year: { type: Number, required: true, default: 2022 },
      licensePlate: { type: String, required: true, default: 'XYZ-1234' },
      color: { type: String, required: true, default: 'Black' },
    },
    // Live Tracking
    isOnline: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    // Performance & Earnings
    rating: {
      type: Number,
      default: 5.0, // Start with a perfect 5 stars
    },
    totalRides: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;