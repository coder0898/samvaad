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

  // ---------------- PROFILE BUTTON ----------------
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

  // ---------------- LOGOUT BUTTON ----------------
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      state.token = null;
      state.user = null;
      state.currentRoomId = null;
      state.currentRoomName = null;
      state.messages = [];
      state.hasJoined = false;

      UI.chatSection().style.display = "none";
      UI.chatList().style.display = "none";
      UI.profileSection().style.display = "none";
      if (UI.msgList()) UI.msgList().innerHTML = "";
      if (UI.currentRoomName()) UI.currentRoomName().textContent = "";

      if (typeof window.showAuthPage === "function") {
        window.showAuthPage();
      }
    });
  }

  // ---------------- BACK BUTTON IN PROFILE ----------------
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      UI.profileSection().style.display = "none";
      UI.chatList().style.display = "block";
      UI.createRoomForm().style.display = "block";
    });
  }

  // ---------------- CONFIRM POPUP YES ----------------
  if (confirmYes) {
    confirmYes.addEventListener("click", () => {
      const action = confirmPopup.dataset.action;
      if (action === "join")
        joinRoom(confirmPopup.dataset.roomId, confirmPopup.dataset.roomName);
      if (action === "leave") leaveRoom();
      confirmPopup.style.display = "none";
    });
  }

  // ---------------- CONFIRM POPUP NO ----------------
  if (confirmNo) {
    confirmNo.addEventListener("click", () => {
      confirmPopup.style.display = "none";
    });
  }

  // ---------------- LEAVE ROOM BUTTON ----------------
  if (chatBackBtn) {
    chatBackBtn.addEventListener("click", () => {
      popupText.textContent = "Do you want to leave this room?";
      confirmPopup.dataset.action = "leave";
      confirmPopup.style.display = "flex";
    });
  }
}

// ---------------- JOIN ROOM ----------------

function joinRoom(id, name) {
  const roomId = id.toString(); // always string

  state.currentRoomId = roomId;
  state.currentRoomName = name;
  state.messages = []; // clear previous messages
  state.hasJoined = true;

  // Clear UI messages
  const msgList = UI.msgList();
  if (msgList) msgList.innerHTML = "";
  if (UI.currentRoomName()) UI.currentRoomName().textContent = `Room: ${name}`;

  UI.listSection()?.style.setProperty("display", "none");
  UI.chatSection()?.style.setProperty("display", "flex");

  if (socket && socket.connected) {
    console.log("Joining room:", roomId, name);
    socket.emit("joinRoom", { roomId }); // notify backend
  } else {
    console.warn("Socket not connected yet. Messages may not load.");
  }
}

// ---------------- LEAVE ROOM ----------------

function leaveRoom() {
  if (state.currentRoomId && socket && socket.connected) {
    socket.emit("leaveRoom", { roomId: state.currentRoomId });
  }

  // Clear state and UI
  state.currentRoomId = null;
  state.currentRoomName = null;
  state.messages = []; // clear old messages
  state.hasJoined = false;

  const msgList = UI.msgList();
  if (msgList) msgList.innerHTML = "";

  UI.listSection()?.style.setProperty("display", "flex");
  UI.chatSection()?.style.setProperty("display", "none");
}
