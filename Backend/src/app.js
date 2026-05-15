import express from "express";
import  { createServer } from "node:http";

import { Server } from "socket.io";

import cors from "cors";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import dotenv from "dotenv";
import userRoutes from "./routes/users.route.js";
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors({
  origin: (origin, callback) => callback(null, true), // Allow all origins dynamically
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json({limit: "40kb" }));
app.use(express.urlencoded({limit: "40kb" , extended: true}));

  app.use("/api/v1/users", userRoutes);
  
  app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", message: "Server is running" });
  });

  app.get("/", (req, res) => {
      res.send("<h1>Let's Meet Backend is Running</h1>");
  });

  app.get("/test-db", async (req, res) => {
      try {
          const state = mongoose.connection.readyState;
          const states = ["disconnected", "connected", "connecting", "disconnecting"];
          const mongoURI = process.env.MongoDB;
          res.json({
              status: states[state],
              mongodb_env: mongoURI ? "Defined" : "Undefined",
              mongoURI_source: mongoURI ? "configured" : "missing"
          });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  });



const start = async () => {
    try {
        const mongoURI = process.env.MongoDB || process.env.MONGODB_URI || process.env.DATABASE_URL;

        if (!mongoURI) {
            throw new Error("MongoDB environment variable is NOT SET. Please configure MongoDB, MONGODB_URI, or DATABASE_URL.");
        }
        const connectionDb = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        console.log(`✅ MONGO Connected: ${connectionDb.connection.host}`);
        
        server.listen(app.get("port"), () => {
            console.log(`Server is running on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        // Still listen on port so deployment health checks can pass,
        // but API/auth routes will fail until the database is available.
        server.listen(app.get("port"), () => {
            console.log(`Server running in ERROR mode on port ${app.get("port")}. Check MongoDB connection.`);
        });
    }
}

start();
