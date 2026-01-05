import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";

export function setupChatEvents() {
  // ---------------- MESSAGE FORM ----------------
  const messageForm = UI.messageForm();
  const messageInput = UI.messageInput();

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

  // ---------------- NEW MESSAGE ----------------
  socket.off("newMessage").on("newMessage", (msg) => {
    if (msg.roomId.toString() !== state.currentRoomId.toString()) return;
    const msgList = UI.msgList();
    appendMessage(msg, msgList);
  });

  // ---------------- ROOM HISTORY ----------------
  socket.off("roomHistory").on("roomHistory", (messages) => {
    const msgList = UI.msgList();
    if (!msgList || !state.currentRoomId) return;

    msgList.innerHTML = "";
    messages.forEach((msg) => {
      if (msg.roomId.toString() === state.currentRoomId.toString()) {
        appendMessage(msg, msgList);
      }
    });
    msgList.scrollTop = msgList.scrollHeight;
  });

  // ---------------- HELPER ----------------
  function appendMessage(msg, msgList) {
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
    console.log("Registering message listener");
  }
}
