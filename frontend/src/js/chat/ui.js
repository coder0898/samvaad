export const UI = {
  listSection: () => document.querySelector(".list-section"),
  chatSection: () => document.querySelector(".chat-section"),
  roomList: () => document.getElementById("roomList"),
  chatList: () => document.querySelector(".chat-list"),
  createRoomForm: () => document.getElementById("create-room-form"),
  inputRoomName: () => document.getElementById("inputRoomName"),
  msgList: () => document.getElementById("msgList"),
  messageForm: () => document.getElementById("message-form"),
  messageInput: () => document.getElementById("message-input"),
  currentRoomName: () => document.getElementById("current-room-name"),
  profileBtn: () => document.getElementById("profileBtn"),
  profileSection: () => document.querySelector(".profile-section"),
  backBtn: () => document.getElementById("backBtn"),
  logoutBtn: () => document.getElementById("logoutBtn"),
  profileUser: () => document.getElementById("profileUser"),
  profileMail: () => document.getElementById("profileMail"),
  chatBackBtn: () => document.getElementById("chatBackBtn"),
  confirmPopup: () => document.getElementById("confirmPopup"),
  confirmYes: () => document.getElementById("confirmYes"),
  confirmNo: () => document.getElementById("confirmNo"),
  popupText: () => document.getElementById("popupText"),
};

// ----------------- Rendering -----------------

export function renderRooms(rooms, currentRoomId = null, currentUser = null) {
  const roomList = UI.roomList();
  if (!roomList) return;
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.className = "room-item";
    if (currentRoomId && room.id.toString() === currentRoomId.toString())
      li.classList.add("active-room");

    const isOwner =
      currentUser &&
      room.createdBy.toLowerCase() === currentUser.username.toLowerCase();

    li.innerHTML = `
      <div class="block">
        <h4 class="h6 fw-semibold mb-1">${room.name}</h4>
        <p class="mb-0 text-muted small">${room.createdBy}</p>
      </div>
      ${
        isOwner
          ? `<button class="delete-btn btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width:42px;height:42px">
              <i class="fa-solid fa-trash"></i>
            </button>`
          : ""
      }
    `;
    roomList.appendChild(li);
  });
}

export function renderMessages(messages) {
  const msgList = UI.msgList();
  if (!msgList) return;

  msgList.innerHTML = "";
  messages.forEach((msg) => appendMessage(msg, msgList));
  msgList.scrollTop = msgList.scrollHeight;
}

export function appendMessage(msg, msgList) {
  if (!msgList) return;

  const li = document.createElement("li");
  li.className = "message-item";
  if (msg.username === "System") li.classList.add("system-message");

  li.innerHTML = `
    <div class="msg-head" style="display:flex; justify-content: space-between; font-size:0.85rem; color:gray;">
      <span>${msg.username}</span>
      <span>${new Date(msg.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}</span>
    </div>
    <div class="msg-text" style="font-size:1.1rem; margin-top:2px;">
      ${msg.text}
    </div>
  `;

  msgList.appendChild(li);
  msgList.scrollTop = msgList.scrollHeight;
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
