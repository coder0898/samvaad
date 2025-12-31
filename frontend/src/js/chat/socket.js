// import { io } from "socket.io-client";
// import { UI, renderRooms, renderMessages } from "./ui.js";
// import { state } from "./state.js";

// export let socket;

// const BaseURL = `https://samvaad-r7bw.onrender.com`;

// export function initSocket(token) {
//   if (!token) {
//     console.warn("No token for socket connection!");
//     return;
//   }

//   // Prevent multiple socket connections
//   if (state.socketInitialized && socket) return;
//   state.socketInitialized = true;

//   socket = io(`${BaseURL}`, { auth: { token } });

//   socket.on("connect", () => {
//     console.log("🟢 Connected:", socket.id);
//     socket.emit("getRooms");
//   });

//   socket.on("roomsList", (rooms) => {
//     state.rooms = rooms;
//     renderRooms(rooms);
//   });

//   socket.on("roomCreated", () => {
//     socket.emit("getRooms");
//   });

//   // ✅ FIX: Do NOT render history if user left room
//   socket.on("roomHistory", (messages) => {
//     if (!state.currentRoomId) return; // 🔥 guard
//     state.messages = messages;
//     renderMessages(messages);
//   });

//   // ✅ FIX: Already guarded, KEEP IT
//   socket.on("newMessage", (msg) => {
//     if (!state.currentRoomId) return;
//     if (msg.roomId !== state.currentRoomId) return;

//     state.messages.push(msg);
//     renderMessages(state.messages);
//   });

//   // ------------------ SPA SAFE EVENT LISTENERS ------------------

//   const createRoomForm = UI.createRoomForm();
//   const inputRoomName = UI.inputRoomName();

//   if (createRoomForm && inputRoomName && !createRoomForm.dataset.listener) {
//     createRoomForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const roomName = inputRoomName.value.trim();
//       if (!roomName) return;
//       socket.emit("createRoom", { name: roomName });
//       inputRoomName.value = "";
//     });
//     createRoomForm.dataset.listener = "true";
//   }

//   const messageForm = UI.messageForm();
//   const messageInput = UI.messageInput();

//   if (messageForm && messageInput && !messageForm.dataset.listener) {
//     messageForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       if (!state.currentRoomId) return; // 🔥 guard
//       const text = messageInput.value.trim();
//       if (!text) return;
//       socket.emit("sendMessage", { roomId: state.currentRoomId, text });
//       messageInput.value = "";
//     });
//     messageForm.dataset.listener = "true";
//   }
// }

import { io } from "socket.io-client";
import { UI, renderRooms, renderMessages } from "./ui.js";
import { state } from "./state.js";

export let socket;
const BaseURL = `https://samvaad-r7bw.onrender.com`;

export function initSocket(token) {
  if (!token) {
    console.warn("No token for socket connection!");
    return;
  }

  // Prevent multiple socket connections
  if (state.socketInitialized && socket) return;
  state.socketInitialized = true;

  socket = io(`${BaseURL}`, { auth: { token } });

  socket.on("connect", () => {
    console.log("🟢 Connected:", socket.id);
  });

  // ----------------- SOCKET EVENTS -----------------

  // Listen for room updates
  socket.on("refreshRooms", (rooms) => {
    state.rooms = rooms;
    renderRooms(rooms);
  });

  // Room chat history
  socket.on("roomHistory", (messages) => {
    if (!state.currentRoomId) return; // guard
    state.messages = messages;
    renderMessages(messages);
  });

  // New chat message
  socket.on("newMessage", (msg) => {
    if (!state.currentRoomId) return;
    if (msg.roomId !== state.currentRoomId) return;

    state.messages.push(msg);
    renderMessages(state.messages);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });

  // ----------------- UI EVENT LISTENERS -----------------

  const createRoomForm = UI.createRoomForm();
  const inputRoomName = UI.inputRoomName();

  if (createRoomForm && inputRoomName && !createRoomForm.dataset.listener) {
    createRoomForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const roomName = inputRoomName.value.trim();
      if (!roomName) return;

      try {
        const res = await fetch(`${BaseURL}/rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: roomName }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create room");

        inputRoomName.value = "";
        // UI will auto-update via refreshRooms
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
    });
    createRoomForm.dataset.listener = "true";
  }

  const messageForm = UI.messageForm();
  const messageInput = UI.messageInput();

  if (messageForm && messageInput && !messageForm.dataset.listener) {
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!state.currentRoomId) return;
      const text = messageInput.value.trim();
      if (!text) return;

      socket.emit("sendMessage", { roomId: state.currentRoomId, text });
      messageInput.value = "";
    });
    messageForm.dataset.listener = "true";
  }
}

// ----------------- ROOM DELETE FUNCTION -----------------
export async function deleteRoom(roomId) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${BaseURL}/rooms/${roomId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete room");
    // UI updates automatically via refreshRooms
  } catch (err) {
    console.error(err.message);
    alert(err.message);
  }
}
