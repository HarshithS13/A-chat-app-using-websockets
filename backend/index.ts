import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { connectToDatabase } from "./db/connection";
import chatService from "./db/services/chatService";
import type { User, Message } from "./db/services/chatService";

// Constants
const INACTIVE_TIMEOUT = 300000; // 5 minutes

// Get port from command line arguments or use default
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const PORT = portIndex >= 0 && args.length > portIndex + 1 
  ? parseInt(args[portIndex + 1] || '3000', 10) 
  : 3000;

// Create HTTP server
const httpServer = createServer();

// Setup Socket.io with CORS that allows any origin
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow any origin to connect
    methods: ["GET", "POST"],
    credentials: true
  },
  pingInterval: 25000,
  pingTimeout: 10000,
});

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log("MongoDB connected successfully");
    startSocketServer();
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// Clean up inactive users periodically
const userCleanupInterval = setInterval(async () => {
  try {
    const deletedCount = await chatService.clearInactiveUsers(INACTIVE_TIMEOUT);
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} inactive users`);
      
      // Get updated user list
      const users = await chatService.getAllUsers();
      
      // Notify all clients about the updated user list
      io.emit("user:list", users);
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}, 60000); // Check every minute

// Helper function to create a system message
const createSystemMessage = (text: string): Message => {
  return {
    id: Date.now().toString(),
    text,
    sender: "system",
    timestamp: Date.now(),
  };
};

// Start Socket.io server
const startSocketServer = async () => {
  // Socket.io connection handler
  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Handle user join
    socket.on("user:join", async ({ userId, username }) => {
      if (!userId || !username) {
        console.error("Invalid join data", { userId, username });
        return;
      }

      try {
        // Add user to database
        const user: User = {
          userId,
          username,
          socketId: socket.id,
          lastActive: Date.now()
        };
        
        await chatService.addUser(user);
        
        // Get all users
        const users = await chatService.getAllUsers();
        
        // Get existing messages
        const messages = await chatService.getLatestMessages();
        
        // Send existing messages to the user
        socket.emit("message:get", messages);
        
        // Notify all users about the updated user list
        io.emit("user:list", users);
        
        // Create welcome message if this is a new user
        const existingUser = users.find(u => u.userId === userId && u.socketId !== socket.id);
        
        if (!existingUser) {
          const welcomeMessage = createSystemMessage(`${username} has joined the chat`);
          await chatService.addMessage(welcomeMessage);
          io.emit("message:new", welcomeMessage);
        }
      } catch (error) {
        console.error("Error handling user join:", error);
      }
    });
    
    // Handle new messages
    socket.on("message:send", async ({ text, sender, userId }) => {
      if (userId) {
        await chatService.updateUserActivity(userId);
      }
      
      try {
        const message: Message = {
          id: Date.now().toString(),
          text,
          sender,
          timestamp: Date.now()
        };
        
        // Save message to database
        await chatService.addMessage(message);
        
        // Broadcast to all clients
        io.emit("message:new", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
    
    // Handle typing status
    socket.on("user:typing", async ({ userId, isTyping }) => {
      if (userId) {
        await chatService.updateUserActivity(userId);
      }
      socket.broadcast.emit("user:typing", { userId, isTyping });
    });
    
    // Handle pings for activity tracking
    socket.on("user:ping", async ({ userId }) => {
      if (userId) {
        await chatService.updateUserActivity(userId);
      }
    });
    
    // Handle disconnection
    socket.on("disconnect", async () => {
      try {
        // Find user by socket ID
        const user = await chatService.findUserBySocketId(socket.id);
        
        if (user) {
          // Store user data before potential removal
          const { userId, username } = user;
          
          // Don't remove the user immediately, just track the disconnection
          setTimeout(async () => {
            try {
              // Check if user is still disconnected
              const reconnected = await chatService.findUserBySocketId(socket.id);
              
              if (!reconnected) {
                // Remove user
                await chatService.removeUser(socket.id);
                
                // Get updated user list
                const users = await chatService.getAllUsers();
                
                // Notify remaining users
                io.emit("user:list", users);
                
                // Send leave message
                const leaveMessage = createSystemMessage(`${username} has left the chat`);
                await chatService.addMessage(leaveMessage);
                io.emit("message:new", leaveMessage);
                
                console.log(`User disconnected: ${username}`);
              }
            } catch (error) {
              console.error("Error handling delayed disconnect:", error);
            }
          }, 5000); // Wait 5 seconds before considering the user truly disconnected
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  // Start server
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`For local access: http://localhost:${PORT}`);
    console.log("For network access, use your machine's IP address");
  });
};

// Handle process termination
process.on("SIGINT", async () => {
  clearInterval(userCleanupInterval);
  console.log("Server shutting down");
  process.exit(0);
});