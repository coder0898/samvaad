import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readData, writeData } from "../util/fileUtil.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOMS_FILE = path.join(__dirname, "../data/room.json");

// Ensure file exists
if (!readData(ROOMS_FILE)) writeData(ROOMS_FILE, []);

export default (io) => {
  // GET ALL ROOMS
  router.get("/", verifyToken, (req, res) => {
    const rooms = readData(ROOMS_FILE) || [];
    res.json({ rooms });
  });

  // CREATE ROOM
  router.post("/", verifyToken, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Room name required" });

    const rooms = readData(ROOMS_FILE) || [];
    const exists = rooms.some(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return res.status(400).json({ message: "Room already exists" });

    const newRoom = {
      id: rooms.length ? rooms[rooms.length - 1].id + 1 : 1,
      name,
      createdBy: req.user.username,
      createdAt: new Date().toISOString(),
    };

    rooms.push(newRoom);
    writeData(ROOMS_FILE, rooms);

    // Broadcast to all clients
    io.emit("refreshRooms");

    res.status(201).json({ message: "Room created", room: newRoom });
  });

  // DELETE ROOM
  router.delete("/:id", verifyToken, (req, res) => {
    const id = Number(req.params.id);
    const rooms = readData(ROOMS_FILE) || [];

    const idx = rooms.findIndex((r) => r.id === id);
    if (idx === -1) return res.status(404).json({ message: "Room not found" });

    if (rooms[idx].createdBy !== req.user.username)
      return res
        .status(403)
        .json({ message: "You can delete only your rooms" });

    rooms.splice(idx, 1);
    writeData(ROOMS_FILE, rooms);

    // Broadcast updated rooms
    io.emit("refreshRooms");

    res.json({ message: "Room deleted" });
  });

  return router;
};
