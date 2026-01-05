import { setupRoomEvents, loadRooms } from "./event/roomEvent.js";
import { setupChatEvents } from "./event/chatEvent.js";
import { setupUserEvents } from "./event/userEvent.js";
import { initSocket } from "./socket.js";
import { state } from "./state.js";

import { showView } from "./ui.js";

export function initChat() {
  if (!state.token) return;

  showView("list"); // show list first

  const socket = initSocket(state.token);

  if (socket && !socket.connected) {
    socket.on("connect", () => {
      console.log("🟢 Socket connected, loading rooms...");
      loadRooms(); // fetch initial rooms after connection
      setupRoomEvents();
      setupChatEvents();
      setupUserEvents();
    });
  } else {
    loadRooms();
    setupRoomEvents();
    setupChatEvents();
    setupUserEvents();
  }
}
