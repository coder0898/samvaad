// import { state } from "../state.js";
// import { socket } from "../socket.js";
// import { UI } from "../ui.js";

// export function setupChatEvents() {
//   const messageForm = UI.messageForm();
//   const messageInput = UI.messageInput();
//   const msgList = UI.msgList();

//   // SPA-safe: Add listener only once
//   if (messageForm && !messageForm.dataset.listener) {
//     messageForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const text = messageInput.value.trim();
//       if (!text || !state.currentRoomId) return;

//       socket.emit("sendMessage", { roomId: state.currentRoomId, text });
//       messageInput.value = "";
//     });
//     messageForm.dataset.listener = "true";
//   }

//   // Receiving new messages
//   socket.off("newMessage").on("newMessage", (msg) => {
//     if (msg.roomId !== state.currentRoomId) return;
//     appendMessage(msg);
//   });

//   // Load room history when joining
//   socket.off("roomHistory").on("roomHistory", (messages) => {
//     if (!msgList) return;
//     msgList.innerHTML = "";
//     messages.forEach(appendMessage);
//     msgList.scrollTop = msgList.scrollHeight;
//   });

//   function appendMessage(msg) {
//     if (!msgList) return;
//     const li = document.createElement("li");
//     li.className = "message-item";
//     if (msg.username === "System") li.classList.add("system-message");

//     li.innerHTML = `
//       <div class="msg-head" style="display:flex; justify-content: space-between; font-size:0.85rem; color:gray;">
//         <span>${msg.username}</span>
//         <span>${new Date(msg.time).toLocaleTimeString()}</span>
//       </div>
//       <div class="msg-text" style="font-size:1.1rem; margin-top:2px;">${
//         msg.text
//       }</div>
//     `;
//     msgList.appendChild(li);
//     msgList.scrollTop = msgList.scrollHeight;
//   }
// }

import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";

export function setupChatEvents() {
  const messageForm = UI.messageForm();
  const messageInput = UI.messageInput();
  const msgList = UI.msgList();

  if (messageForm && !messageForm.dataset.listener) {
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = messageInput.value.trim();
      if (!text || !state.currentRoomId) return;

      socket.emit("sendMessage", { roomId: state.currentRoomId, text });
      messageInput.value = "";
    });
    messageForm.dataset.listener = "true";
  }

  socket.off("newMessage").on("newMessage", (msg) => {
    if (msg.roomId !== state.currentRoomId) return;
    appendMessage(msg);
  });

  // socket.off("roomHistory").on("roomHistory", (messages) => {
  //   if (!msgList) return;
  //   msgList.innerHTML = "";
  //   messages.forEach(appendMessage);
  //   msgList.scrollTop = msgList.scrollHeight;
  // });

  socket.off("roomHistory").on("roomHistory", (messages) => {
    const msgList = UI.msgList();
    if (!msgList || !state.currentRoomId) return; // 🔥 guard
    msgList.innerHTML = "";
    messages.forEach(appendMessage);
    msgList.scrollTop = msgList.scrollHeight;
  });

  function appendMessage(msg) {
    if (!msgList) return;
    const li = document.createElement("li");
    li.className = "message-item";
    if (msg.username === "System") li.classList.add("system-message");

    li.innerHTML = `
      <div class="msg-head" style="display:flex; justify-content: space-between; font-size:0.85rem; color:gray;">
        <span>${msg.username}</span>
        <span>${new Date(msg.time).toLocaleTimeString()}</span>
      </div>
      <div class="msg-text" style="font-size:1.1rem; margin-top:2px;">
        ${msg.text}
      </div>
    `;
    msgList.appendChild(li);
    msgList.scrollTop = msgList.scrollHeight;
  }
}
