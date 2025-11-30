// socket.js
import { io } from "socket.io-client";
import { UI, renderRooms, renderMessages } from "./ui.js";
import { state } from "./state.js"; // make sure this exists

export let socket;

const BaseURL = ` https://samvaad-r7bw.onrender.com`;

export function initSocket(token) {
  socket = io(`${BaseURL}`, {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("🟢 Connected:", socket.id);
    // Fetch rooms immediately
    socket.emit("getRooms");
  });

  // Rooms list
  socket.on("roomsList", (rooms) => {
    state.rooms = rooms;
    renderRooms(rooms);
  });

  // Room created
  socket.on("roomCreated", (room) => {
    console.log("Room created:", room);
    socket.emit("getRooms"); // refresh rooms list
  });

  // Chat messages for a room
  socket.on("roomHistory", (messages) => {
    state.messages = messages;
    renderMessages(messages);
  });

  // New incoming message
  socket.on("newMessage", (msg) => {
    if (msg.roomId !== state.currentRoomId) return;
    state.messages.push(msg);
    renderMessages(state.messages);
  });

  // Handle create room form
  if (UI.createRoomForm) {
    UI.createRoomForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const roomName = UI.inputRoomName.value.trim();
      if (!roomName) return;

      socket.emit("createRoom", { name: roomName });
      UI.inputRoomName.value = "";
    });
  }

  // Handle sending a message
  if (UI.messageForm) {
    UI.messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = UI.messageInput.value.trim();
      if (!text || !state.currentRoomId) return;

      const msgData = {
        roomId: state.currentRoomId,
        text,
      };

      socket.emit("sendMessage", msgData);
      UI.messageInput.value = "";
    });
  }

  // Optional: handle clicking a room to join
  if (UI.roomList) {
    UI.roomList.addEventListener("click", (e) => {
      const li = e.target.closest(".room-item");
      if (!li) return;

      const roomId = li.dataset.id;
      state.currentRoomId = roomId;
      UI.currentRoomName.textContent = li.textContent;

      // Fetch room history
      socket.emit("joinRoom", { roomId });
    });
  }
}
