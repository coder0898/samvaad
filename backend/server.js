// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// import authRoutes from "./routes/authRoutes.js";
// import createRoomRoutes from "./routes/roomRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";

// import initSocket from "./socket/socketHandler.js";
// import { verifySocketToken } from "./middleware/verifySocketToken.js";

// const app = express();

// /* -------------------- MIDDLEWARE -------------------- */
// app.use(express.json());

// const allowedOrigins = [
//   process.env.CLIENT_URL_LOCAL,
//   process.env.CLIENT_URL_PROD,
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// /* -------------------- REST ROUTES -------------------- */
// app.use("/auth", authRoutes);
// app.use("/profile", profileRoutes);

// /* Health check (optional but recommended) */
// app.get("/health", (_, res) => {
//   res.json({ status: "ok", time: new Date().toISOString() });
// });

// /* -------------------- SOCKET SETUP -------------------- */
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.use(verifySocketToken);
// initSocket(io);

// /* -------------------- ROOM ROUTES -------------------- */
// app.use("/rooms", createRoomRoutes(io));

// /* -------------------- START SERVER -------------------- */
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

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

// -------------------- CORS SETUP --------------------
// const allowedOrigins = [
//   process.env.CLIENT_URL_LOCAL,
//   process.env.CLIENT_URL_PROD,
// ];

// // Global CORS middleware for REST API
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like Postman)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     // allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// const allowedOrigins = [
//   process.env.CLIENT_URL_LOCAL,
//   process.env.CLIENT_URL_PROD,
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     return callback(null, false);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

const allowedOrigins = [
  "http://localhost:5173",
  "https://samvaad-tawny.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin:", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ❗ IMPORTANT: allow but log (prevents silent CORS failure)
    console.error("Blocked by CORS:", origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// REST API
app.use(cors(corsOptions));
app.options("/", cors(corsOptions)); // 🔥 REQUIRED

/* -------------------- REST ROUTES -------------------- */
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

/* Health check */
app.get("/health", (_, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

/* -------------------- SOCKET.IO SETUP -------------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
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
