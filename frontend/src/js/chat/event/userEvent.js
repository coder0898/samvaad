import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";
import { fetchProfile } from "../api.js";

export function setupUserEvents() {
  const profileBtn = UI.profileBtn();
  const logoutBtn = UI.logoutBtn();
  const backBtn = UI.backBtn();
  const confirmYes = UI.confirmYes();
  const confirmNo = UI.confirmNo();
  const chatBackBtn = UI.chatBackBtn();
  const confirmPopup = UI.confirmPopup();
  const popupText = UI.popupText();

  // Profile button
  if (profileBtn) {
    profileBtn.addEventListener("click", async () => {
      const data = await fetchProfile();
      UI.profileUser().textContent = data.user.username;
      UI.profileMail().textContent = data.user.email;

      UI.chatList().style.display = "none";
      UI.createRoomForm().style.display = "none";
      UI.profileSection().style.display = "block";
    });
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      state.token = null;
      state.user = null;
      state.currentRoomId = null;
      state.currentRoomName = null;
      state.messages = [];

      UI.chatSection().style.display = "none";
      UI.chatList().style.display = "none";
      UI.profileSection().style.display = "none";
      UI.msgList().innerHTML = "";
      if (UI.currentRoomName()) UI.currentRoomName().textContent = "";

      if (typeof window.showAuthPage === "function") {
        window.showAuthPage();
      }
    });
  }

  // Back button in profile
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      UI.profileSection().style.display = "none";
      UI.chatList().style.display = "block";
      UI.createRoomForm().style.display = "block";
    });
  }

  // Confirm popup Yes/No
  if (confirmYes) {
    confirmYes.addEventListener("click", () => {
      const action = confirmPopup.dataset.action;
      if (action === "join")
        joinRoom(confirmPopup.dataset.roomId, confirmPopup.dataset.roomName);
      if (action === "leave") leaveRoom();
      confirmPopup.style.display = "none";
    });
  }

  if (confirmNo) {
    confirmNo.addEventListener("click", () => {
      confirmPopup.style.display = "none";
    });
  }

  // Leave room button inside chat
  if (chatBackBtn) {
    chatBackBtn.addEventListener("click", () => {
      popupText.textContent = "Leave this room?";
      confirmPopup.dataset.action = "leave";
      confirmPopup.style.display = "flex";
    });
  }
}

// Join Room
function joinRoom(id, name) {
  state.currentRoomId = id;
  state.currentRoomName = name;
  state.messages = [];
  state.hasJoined = true;

  const msgList = UI.msgList();
  if (msgList) msgList.innerHTML = "";
  UI.currentRoomName().textContent = `Room: ${name}`;

  document.querySelector(".list-section")?.style.setProperty("display", "none");
  UI.chatSection().style.setProperty("display", "flex");

  socket.emit("joinRoom", { roomId: id });
}

// Leave Room
function leaveRoom() {
  if (state.currentRoomId) {
    socket.emit("leaveRoom", { roomId: state.currentRoomId });
  }

  state.currentRoomId = null;
  state.currentRoomName = null;
  state.messages = [];
  state.hasJoined = false;

  const msgList = UI.msgList();
  if (msgList) msgList.innerHTML = "";

  document.querySelector(".list-section")?.style.setProperty("display", "flex");
  UI.chatSection().style.setProperty("display", "none");
}
