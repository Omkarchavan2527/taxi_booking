import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // process.env.MONGO_URI is now guaranteed to exist because of server.js
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the server if the database fails
  }
};