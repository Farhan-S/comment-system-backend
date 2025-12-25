import { createServer } from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { config } from "./config/env";
import { initializeSocket } from "./config/socket";

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP Server
    const httpServer = createServer(app);

    // Initialize Socket.io
    initializeSocket(httpServer);

    // Start Server - Listen on 0.0.0.0 for CapRover/Docker compatibility
    const server = httpServer.listen(config.port, "0.0.0.0", () => {
      console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
      console.log("Socket.io initialized for real-time updates");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error("UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on("SIGTERM", () => {
      console.log("SIGTERM RECEIVED. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated!");
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
