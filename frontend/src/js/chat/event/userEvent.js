import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";
import { fetchProfile } from "../api.js";

export function setupUserEvents() {
  UI.profileBtn.addEventListener("click", async () => {
    const data = await fetchProfile();

    UI.profileUser.textContent = data.user.username;
    UI.profileMail.textContent = data.user.email;

    UI.profileSection.style.display = "block";
    UI.chatList.style.display = "none";
  });

  UI.logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  UI.backBtn.addEventListener("click", () => {
    UI.profileSection.style.display = "none";
    UI.chatList.style.display = "block";
  });

  UI.confirmYes.addEventListener("click", () => {
    const action = UI.confirmPopup.dataset.action;

    if (action === "join") {
      joinRoom(
        UI.confirmPopup.dataset.roomId,
        UI.confirmPopup.dataset.roomName
      );
    }

    if (action === "leave") leaveRoom();

    UI.confirmPopup.style.display = "none";
  });

  UI.confirmNo.addEventListener("click", () => {
    UI.confirmPopup.style.display = "none";
  });

  // Leave button inside chat
  UI.chatBackBtn.addEventListener("click", () => {
    UI.popupText.textContent = "Leave this room?";
    UI.confirmPopup.dataset.action = "leave";
    UI.confirmPopup.style.display = "flex";
  });
}

// JOIN ROOM
function joinRoom(id, name) {
  state.currentRoomId = id;
  state.currentRoomName = name;
  state.messages = [];

  UI.msgList.innerHTML = "";
  UI.currentRoomName.textContent = `Room: ${name}`;

  UI.chatSection.style.display = "flex";
  UI.chatList.style.display = "none";

  socket.emit("joinRoom", { roomId: id });
}

// LEAVE ROOM
function leaveRoom() {
  socket.emit("leaveRoom", { roomId: state.currentRoomId });

  state.currentRoomId = null;
  state.currentRoomName = null;
  state.messages = [];

  UI.msgList.innerHTML = "";
  UI.chatSection.style.display = "none";
  UI.chatList.style.display = "block";
}
