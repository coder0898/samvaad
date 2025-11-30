import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";
import { fetchRooms, createRoom, deleteRoom } from "../api.js";

export async function loadRooms() {
  const data = await fetchRooms();

  state.roomData = data.rooms || [];
  UI.roomList.innerHTML = "";

  state.roomData.forEach((room) => {
    const li = document.createElement("li");
    li.className = "room-item";
    li.innerHTML = `
      <div class="block">
        <h4>${room.name}</h4>
        <p>${room.createdBy}</p>
      </div>
      ${
        room.createdBy.toLowerCase() === state.user.username.toLowerCase()
          ? `<button class="delete-btn" data-id="${room.id}">
              <i class="fa-solid fa-trash"></i>
            </button>`
          : ""
      }
    `;

    li.addEventListener("click", () => {
      UI.confirmPopup.dataset.action = "join";
      UI.confirmPopup.dataset.roomId = room.id;
      UI.confirmPopup.dataset.roomName = room.name;
      UI.popupText.textContent = "Join this room?";
      UI.confirmPopup.style.display = "flex";
    });

    const btn = li.querySelector(".delete-btn");
    if (btn) {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();

        const result = await deleteRoom(room.id);
        if (!result.error) {
          socket.emit("roomUpdated");
          loadRooms();
        }
      });
    }

    UI.roomList.appendChild(li);
  });
}

export function setupRoomEvents() {
  UI.createRoomForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = UI.inputRoomName.value.trim();

    const result = await createRoom(name);
    if (!result.error) {
      UI.inputRoomName.value = "";
      socket.emit("roomUpdated");
      loadRooms();
    }
  });

  socket.on("refreshRooms", loadRooms);
}
