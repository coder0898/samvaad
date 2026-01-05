// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// import authRoutes from "./routes/authRoutes.js";
// import createRoomRoutes from "./routes/roomRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";

// import initSocket from "./socket/socketHandler.js";
// import { verifySocketToken } from "./middleware/verifySocketToken.js";

// const app = express();
// app.use(express.json());

// app.use(cors());

// // Routes
// app.use("/auth", authRoutes);
// app.use("/profile", profileRoutes);
// // app.use("/chats", chatRoutes);

// // Socket setup
// const server = http.createServer(app);
// const allowedOrigins = [
//   process.env.CLIENT_URL_LOCAL,
//   process.env.CLIENT_URL_PROD,
// ];

// // For Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.use(verifySocketToken);
// initSocket(io);

// // Room routes need io for refresh
// app.use("/rooms", createRoomRoutes(io));

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import createRoomRoutes from "./routes/roomRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import initSocket from "./socket/socketHandler.js";
import { verifySocketToken } from "./middleware/verifySocketToken.js";

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL,
  process.env.CLIENT_URL_PROD,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* -------------------- REST ROUTES -------------------- */
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

/* Health check (optional but recommended) */
app.get("/health", (_, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

/* -------------------- SOCKET SETUP -------------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(verifySocketToken);
initSocket(io);

/* -------------------- ROOM ROUTES -------------------- */
app.use("/rooms", createRoomRoutes(io));

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
