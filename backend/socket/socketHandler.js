import { saveMessage, readRoomMessages } from "../util/chatStore.js";

export default function initSocket(io) {
  // In-memory cache per roomId (string)
  const memoryCache = {};

  io.on("connection", (socket) => {
    console.log(`🟢 Connected: ${socket.id} (${socket.user.username})`);

    /**
     * JOIN ROOM
     */

    socket.on("joinRoom", ({ roomId }) => {
      if (!roomId) return;

      const rid = String(roomId);

      socket.join(rid);

      // SEND EMPTY HISTORY to frontend
      socket.emit("roomHistory", []);

      // Add join message (optional)
      const joinMsg = {
        roomId: rid,
        username: "System",
        text: `${socket.user.username} joined the room`,
        time: new Date().toISOString(),
      };

      // Store it in memory only if you want current session messages
      if (!memoryCache[rid]) memoryCache[rid] = [];
      memoryCache[rid].push(joinMsg);

      socket.to(rid).emit("newMessage", joinMsg);
    });

    /**
     * SEND MESSAGE
     */
    socket.on("sendMessage", ({ roomId, text }) => {
      if (!roomId || !text) return;

      const rid = String(roomId);

      if (!memoryCache[rid]) {
        memoryCache[rid] = readRoomMessages(rid) || [];
      }

      const msg = {
        roomId: rid,
        username: socket.user.username,
        text,
        time: new Date().toISOString(),
      };

      memoryCache[rid].push(msg);
      saveMessage(rid, msg);

      io.to(rid).emit("newMessage", msg);
    });

    /**
     * LEAVE ROOM
     */

    socket.on("leaveRoom", ({ roomId }) => {
      if (!roomId) return;

      const rid = String(roomId);
      socket.leave(rid);

      const leaveMsg = {
        roomId: rid,
        username: "System",
        text: `${socket.user.username} left the room`,
        time: new Date().toISOString(),
      };

      // Push leave message to memory for current session
      if (!memoryCache[rid]) memoryCache[rid] = [];
      memoryCache[rid].push(leaveMsg);

      socket.to(rid).emit("newMessage", leaveMsg);

      // Optional: if room empty, clear memory cache
      const clients = io.sockets.adapter.rooms.get(rid);
      if (!clients || clients.size === 0) {
        memoryCache[rid] = [];
      }
    });

    /**
     * DISCONNECT
     */
    socket.on("disconnect", () => {
      console.log(`🔴 Disconnected: ${socket.id}`);
    });
  });
}
