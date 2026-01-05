import { io } from "socket.io-client";
import { state } from "./state.js";

export let socket;
const BaseURL = import.meta.env.VITE_BACKEND_URL;

export function initSocket(token) {
  if (!token) {
    console.warn("No token for socket connection!");
    return;
  }

  if (socket) return socket;

  socket = io(BaseURL, {
    auth: { token },
    transports: ["websocket"],
  });

  // -------------------- SOCKET EVENTS --------------------
  if (!state.listenersRegistered) {
    state.listenersRegistered = true;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    socket.on("roomHistory", (messages) => {
      if (!state.currentRoomId) return;

      if (state.messages.length === 0) {
        state.messages = messages || [];
        document.dispatchEvent(
          new CustomEvent("roomHistoryUpdated", { detail: state.messages })
        );
      } else {
        console.log("🔹 Ignored old room history to start fresh.");
      }
    });

    socket.on("newMessage", (msg) => {
      if (!state.currentRoomId) return;
      if (msg.roomId.toString() !== state.currentRoomId.toString()) return;

      state.messages.push(msg);
      document.dispatchEvent(
        new CustomEvent("newMessageReceived", { detail: msg })
      );
    });
    return socket;
  }
}
