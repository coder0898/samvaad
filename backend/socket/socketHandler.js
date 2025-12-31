// import { saveMessage, readRoomMessages } from "../util/chatStore.js";

// export default function initSocket(io) {
//   const memoryCache = {};

//   io.on("connection", (socket) => {
//     console.log(`🟢 Connected: ${socket.id} (${socket.user.username})`);

//     // Join Room
//     socket.on("joinRoom", ({ roomId }) => {
//       socket.join(roomId);

//       if (!memoryCache[roomId]) memoryCache[roomId] = readRoomMessages(roomId);

//       socket.emit("roomHistory", memoryCache[roomId]);

//       const joinMsg = {
//         roomId,
//         username: "System",
//         text: `${socket.user.username} joined the room`,
//         time: new Date().toISOString(),
//       };

//       memoryCache[roomId].push(joinMsg);
//       saveMessage(roomId, joinMsg);
//       io.to(roomId).emit("newMessage", joinMsg);
//     });

//     // Send Message
//     socket.on("sendMessage", ({ roomId, text }) => {
//       const msg = {
//         roomId,
//         username: socket.user.username,
//         text,
//         time: new Date().toISOString(),
//       };

//       if (!memoryCache[roomId]) memoryCache[roomId] = [];
//       memoryCache[roomId].push(msg);
//       saveMessage(roomId, msg);

//       io.to(roomId).emit("newMessage", msg);
//     });

//     // Leave Room
//     socket.on("leaveRoom", ({ roomId }) => {
//       socket.leave(roomId);

//       const leaveMsg = {
//         roomId,
//         username: "System",
//         text: `${socket.user.username} left the room`,
//         time: new Date().toISOString(),
//       };

//       if (!memoryCache[roomId]) memoryCache[roomId] = [];
//       memoryCache[roomId].push(leaveMsg);
//       saveMessage(roomId, leaveMsg);

//       io.to(roomId).emit("newMessage", leaveMsg);
//     });

//     socket.on("disconnect", () => {
//       console.log(`🔴 Disconnected: ${socket.id}`);
//     });
//   });
// }

import { saveMessage, readRoomMessages } from "../util/chatStore.js";

export default function initSocket(io) {
  const memoryCache = {};

  io.on("connection", (socket) => {
    console.log(`🟢 Connected: ${socket.id} (${socket.user.username})`);

    // Join Room
    socket.on("joinRoom", ({ roomId }) => {
      // If room was deleted, prevent joining
      if (!memoryCache[roomId]) {
        memoryCache[roomId] = readRoomMessages(roomId) || [];
      }

      socket.join(roomId);

      socket.emit("roomHistory", memoryCache[roomId]);

      const joinMsg = {
        roomId,
        username: "System",
        text: `${socket.user.username} joined the room`,
        time: new Date().toISOString(),
      };

      memoryCache[roomId].push(joinMsg);
      saveMessage(roomId, joinMsg);
      io.to(roomId).emit("newMessage", joinMsg);
    });

    // Send Message
    socket.on("sendMessage", ({ roomId, text }) => {
      if (!memoryCache[roomId]) memoryCache[roomId] = [];

      const msg = {
        roomId,
        username: socket.user.username,
        text,
        time: new Date().toISOString(),
      };

      memoryCache[roomId].push(msg);
      saveMessage(roomId, msg);

      io.to(roomId).emit("newMessage", msg);
    });

    // Leave Room
    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);

      const leaveMsg = {
        roomId,
        username: "System",
        text: `${socket.user.username} left the room`,
        time: new Date().toISOString(),
      };

      if (!memoryCache[roomId]) memoryCache[roomId] = [];
      memoryCache[roomId].push(leaveMsg);
      saveMessage(roomId, leaveMsg);

      io.to(roomId).emit("newMessage", leaveMsg);
    });

    // Optional: Clean up memoryCache when rooms are deleted
    socket.on("refreshRooms", (rooms) => {
      const existingRoomIds = rooms.map((r) => r.id.toString());
      Object.keys(memoryCache).forEach((roomId) => {
        if (!existingRoomIds.includes(roomId)) {
          delete memoryCache[roomId]; // remove deleted room from memory
        }
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Disconnected: ${socket.id}`);
    });
  });
}
