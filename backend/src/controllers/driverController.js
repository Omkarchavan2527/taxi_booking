import Driver from '../models/Driver.js';
import Ride from '../models/Ride.js';

// Get Driver Profile
export const getDriverProfile = async (req, res) => {
  try {
    // Find the driver profile linked to the logged-in user
    const driver = await Driver.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Driver Status (Online/Offline & Location)
export const updateDriverStatus = async (req, res) => {
  try {
    const { isOnline, lat, lng } = req.body;
    
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    // Update status
    if (isOnline !== undefined) driver.isOnline = isOnline;
    
    // Update location if provided
    if (lat && lng) {
      driver.currentLocation = { lat, lng };
    }

    await driver.save();
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Driver Earnings & Activity (For Screen 8)
export const getDriverEarnings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    // 1. Get recent rides (Activity List)
    const recentRides = await Ride.find({ 
      driver: driver._id, 
      status: 'completed' 
    })
    .sort({ endTime: -1 })
    .limit(10)
    .populate('user', 'name avatar');

    // 2. Calculate Weekly Earnings (Simple aggregation)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyRides = await Ride.find({
      driver: driver._id,
      status: 'completed',
      endTime: { $gte: oneWeekAgo }
    });

    const totalWeeklyEarnings = weeklyRides.reduce((acc, ride) => acc + (ride.fare || 0), 0);
    const totalWeeklyTrips = weeklyRides.length;

    // Build the 7-day chart data array
    const chartData = [0, 0, 0, 0, 0, 0, 0];
    weeklyRides.forEach(ride => {
      const dayIndex = ride.endTime.getDay(); // 0 (Sun) to 6 (Sat)
      chartData[dayIndex] += (ride.fare || 0);
    });

    res.json({
      totalEarnings: driver.totalEarnings,
      weeklyEarnings: totalWeeklyEarnings,
      weeklyTrips: totalWeeklyTrips,
      chartData,
      recentRides
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};