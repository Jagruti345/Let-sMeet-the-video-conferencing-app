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
     origin: [
    "http://localhost:5173", // local dev
    "https://lets-meet-the-video-conferencing-app-eaur.onrender.com" // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({limit: "40kb" }));
app.use(express.urlencoded({limit: "40kb" , extended: true}));

  app.use("/api/v1/users", userRoutes);


const start = async () => {
    const connectionDb = await mongoose.connect(process.env.MongoDB);
    console.log(`MONGO Connection DB $Host: ${connectionDb.connection.host}`)

    
    server.listen(app.get("port"),()=>{
        console.log(`Server is running on port ${app.get("port")}`);
    });
}

start();
