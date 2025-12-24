import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { config } from "./env";

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin:
        config.nodeEnv === "production"
          ? ["https://your-frontend-domain.com"] // Update with your production frontend URL
          : ["http://localhost:3000", "http://localhost:5173"], // Common React/Vite dev ports
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a room for real-time updates
    socket.on("join", (data) => {
      console.log(`Client ${socket.id} joined:`, data);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
