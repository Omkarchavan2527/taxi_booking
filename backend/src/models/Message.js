import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    // The specific trip this chat belongs to
    ride: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Ride', 
      required: true 
    },
    // The person sending the message
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
  },
  { 
    timestamps: true 
  }
);

const Message = mongoose.model('Message', messageSchema);

// This ensures your chatController.js can import it!
export default Message;