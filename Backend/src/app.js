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
  origin: "*", // Allows any frontend (Vercel, Render, etc.) to connect
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
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



const start = async () => {
    try {
        if (!process.env.MongoDB) {
            throw new Error("MongoDB Environment Variable is NOT SET. Please check your Render/Deployment settings.");
        }
        const connectionDb = await mongoose.connect(process.env.MongoDB);
        console.log(`MONGO Connection DB $Host: ${connectionDb.connection.host}`)
        
        server.listen(app.get("port"), () => {
            console.log(`Server is running on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        // Still listen on port so Render doesn't think the deployment failed, 
        // but routes will probably fail if they depend on DB
        server.listen(app.get("port"), () => {
            console.log(`Server running in ERROR mode on port ${app.get("port")}. Check MongoDB connection.`);
        });
    }
}

start();
