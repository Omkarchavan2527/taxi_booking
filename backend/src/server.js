import 'dotenv/config'; // Automatically loads .env file
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './services/Socket.js'

const PORT = process.env.PORT || 5000;

// Create HTTP server instance to share with Socket.io
const server = http.createServer(app);

// Initialize Sockets
initSocket(server);

// Start Server after DB connects
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 SwiftRide Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});