import { setupRoomEvents, loadRooms } from "./event/roomEvent.js";
import { setupChatEvents } from "./event/chatEvent.js";
import { setupUserEvents } from "./event/userEvent.js";
import { initSocket } from "./socket.js";
import { state } from "./state.js";

import { showView } from "./ui.js";

export function initChat() {
  if (!state.token) return;

  showView("list"); // ✅ SHOW LIST FIRST

  initSocket(state.token);
  loadRooms();
  setupRoomEvents();
  setupChatEvents();
  setupUserEvents();
}
