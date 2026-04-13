import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`📡 Client connected: ${socket.id}`);

    // User joins a specific ride room (called when active ride screen mounts)
    socket.on('ride:join', ({ rideId }) => {
      socket.join(rideId);
      console.log(`Socket ${socket.id} joined ride room: ${rideId}`);
    });

    // --- Driver Events ---
    socket.on('driver:update-location', (data) => {
      // Broadcast driver's moving car to the rider in that specific ride room
      if (data.rideId) {
        io.to(data.rideId).emit('ride:driver-location', { lat: data.lat, lng: data.lng });
      } else {
        // Or broadcast to all nearby searching riders
        socket.broadcast.emit('driver:nearby', data);
      }
    });

    socket.on('driver:accept-ride', ({ rideId }) => {
      io.emit('ride:accepted', { rideId, message: 'Driver is on the way!' });
    });

    socket.on('driver:decline-ride', ({ rideId }) => {
      console.log(`Driver declined ride ${rideId}`);
    });

    socket.on('driver:complete-ride', ({ rideId }) => {
      console.log(`Driver completed ride ${rideId}`);
      // Notify the specific rider that the ride is done
      io.emit(`ride:completed:${rideId}`, { rideId, message: 'You have arrived at your destination!' });
    });

    // --- Chat Events ---
    socket.on('chat:typing', ({ rideId, isTyping }) => {
      // Send typing indicator to the other person in the room
      socket.to(rideId).emit('chat:typing', { isTyping });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};
