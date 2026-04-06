import Message from '../models/Message.js'; // <-- FIXED: Removed curly braces
import { getIO } from '../services/socket.js';

// Get all messages for a specific ride
export const getMessages = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const messages = await Message.find({ ride: rideId })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 }); // Oldest to newest
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    // 1. Save to database
    const message = await Message.create({
      ride: rideId,
      sender: senderId,
      content
    });

    const populatedMessage = await message.populate('sender', 'name avatar role');

    // 2. Emit via Socket.io to the specific ride "room"
    const io = getIO();
    io.to(rideId).emit('chat:new-message', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};