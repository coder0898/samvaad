// // ui.js
// export const UI = {
//   // Rooms
//   roomList: document.getElementById("roomList"),
//   createRoomForm: document.getElementById("create-room-form"),
//   inputRoomName: document.getElementById("inputRoomName"),

//   // Messages
//   msgList: document.getElementById("msgList"),
//   messageForm: document.getElementById("message-form"),
//   messageInput: document.getElementById("message-input"),
//   currentRoomName: document.getElementById("current-room-name"),

//   // Profile
//   profileBtn: document.getElementById("profileBtn"),
//   profileSection: document.querySelector(".profile-section"),
//   chatList: document.querySelector(".chat-list"),
//   backBtn: document.getElementById("backBtn"),
//   logoutBtn: document.getElementById("logoutBtn"),
//   profileUser: document.getElementById("profileUser"),
//   profileMail: document.getElementById("profileMail"),

//   // Chat section
//   chatSection: document.querySelector(".chat-section"),
//   chatBackBtn: document.getElementById("chatBackBtn"),

//   // Confirm popup
//   confirmPopup: document.getElementById("confirmPopup"),
//   confirmYes: document.getElementById("confirmYes"),
//   confirmNo: document.getElementById("confirmNo"),
//   popupText: document.getElementById("popupText"),
// };

// // Render rooms
// export function renderRooms(rooms) {
//   if (!UI.roomList) return;
//   UI.roomList.innerHTML = "";
//   rooms.forEach((room) => {
//     const li = document.createElement("li");
//     li.textContent = room.name;
//     li.dataset.id = room.id; // optional: store room id
//     li.classList.add("room-item");
//     UI.roomList.appendChild(li);
//   });
// }

// // Render messages
// export function renderMessages(messages) {
//   if (!UI.msgList) return;
//   UI.msgList.innerHTML = "";
//   messages.forEach((msg) => {
//     const li = document.createElement("li");
//     li.textContent = `${msg.sender}: ${msg.text}`;
//     UI.msgList.appendChild(li);
//   });
// }

export const UI = {
  // Containers
  listSection: () => document.querySelector(".list-section"),
  chatSection: () => document.querySelector(".chat-section"),

  // Rooms
  roomList: () => document.getElementById("roomList"),
  chatList: () => document.querySelector(".chat-list"),
  createRoomForm: () => document.getElementById("create-room-form"),
  inputRoomName: () => document.getElementById("inputRoomName"),

  // Messages
  msgList: () => document.getElementById("msgList"),
  messageForm: () => document.getElementById("message-form"),
  messageInput: () => document.getElementById("message-input"),
  currentRoomName: () => document.getElementById("current-room-name"),

  // Profile
  profileBtn: () => document.getElementById("profileBtn"),
  profileSection: () => document.querySelector(".profile-section"),
  backBtn: () => document.getElementById("backBtn"),
  logoutBtn: () => document.getElementById("logoutBtn"),
  profileUser: () => document.getElementById("profileUser"),
  profileMail: () => document.getElementById("profileMail"),

  // Chat
  chatBackBtn: () => document.getElementById("chatBackBtn"),

  // Popup
  confirmPopup: () => document.getElementById("confirmPopup"),
  confirmYes: () => document.getElementById("confirmYes"),
  confirmNo: () => document.getElementById("confirmNo"),
  popupText: () => document.getElementById("popupText"),
};

// Render rooms
export function renderRooms(rooms) {
  const roomList = UI.roomList();
  if (!roomList) return;
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.textContent = room.name;
    li.dataset.id = room.id;
    li.classList.add("room-item");
    roomList.appendChild(li);
  });
}

// Render messages
export function renderMessages(messages) {
  const msgList = UI.msgList();
  if (!msgList) return;
  msgList.innerHTML = "";
  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = `${msg.sender}: ${msg.text}`;
    msgList.appendChild(li);
  });
}

export function showView(view) {
  const list = UI.listSection();
  const chat = UI.chatSection();

  if (!list || !chat) return;

  list.classList.remove("active");
  chat.classList.remove("active");

  if (view === "list") list.classList.add("active");
  if (view === "chat") chat.classList.add("active");
}
