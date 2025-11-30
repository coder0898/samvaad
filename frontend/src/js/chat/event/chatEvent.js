import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";

export function setupChatEvents() {
  // Sending message
  UI.messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = UI.messageInput.value.trim();
    if (!text || !state.currentRoomId) return;

    socket.emit("sendMessage", {
      roomId: state.currentRoomId,
      text,
    });

    UI.messageInput.value = "";
  });

  // Receiving new messages
  socket.on("newMessage", (msg) => {
    if (msg.roomId !== state.currentRoomId) return;

    const li = document.createElement("li");
    li.className = "message-item";
    if (msg.username === "System") li.classList.add("system-message");

    li.innerHTML = `
      <div class="msg-head" style="display:flex; justify-content: space-between; font-size:0.85rem; color:gray;">
        <span>${msg.username}</span>
        <span>${new Date(msg.time).toLocaleTimeString()}</span>
      </div>
      <div class="msg-text" style="font-size:1.1rem; margin-top:2px;">${
        msg.text
      }</div>
    `;
    UI.msgList.appendChild(li);
    UI.msgList.scrollTop = UI.msgList.scrollHeight;
  });

  // Load room history when joining
  socket.on("roomHistory", (messages) => {
    UI.msgList.innerHTML = "";
    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.className = "message-item";
      if (msg.username === "System") li.classList.add("system-message");

      li.innerHTML = `
        <div class="msg-head" style="display:flex; justify-content: space-between; font-size:0.85rem; color:gray;">
          <span>${msg.username}</span>
          <span>${new Date(msg.time).toLocaleTimeString()}</span>
        </div>
        <div class="msg-text" style="font-size:1.1rem; margin-top:2px;">${
          msg.text
        }</div>
      `;
      UI.msgList.appendChild(li);
    });
    UI.msgList.scrollTop = UI.msgList.scrollHeight;
  });
}
