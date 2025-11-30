import { setupRoomEvents, loadRooms } from "./event/roomEvent.js";
import { setupChatEvents } from "./event/chatEvent.js";
import { setupUserEvents } from "./event/userEvent.js";
import { initSocket } from "./socket.js";
import { state } from "./state.js";

export function initChat() {
  initSocket(state.token);

  loadRooms();
  setupRoomEvents();
  setupChatEvents();
  setupUserEvents();
}
