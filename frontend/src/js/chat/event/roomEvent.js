import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";
import { fetchRooms, createRoom, deleteRoom } from "../api.js";

// ---------------- LOAD ROOMS ----------------
export async function loadRooms() {
  const roomList = UI.roomList();
  if (!roomList) return;

  roomList.innerHTML = `<li class="loading">Loading rooms...</li>`;

  try {
    const data = await fetchRooms();
    state.rooms = data.rooms || [];
    renderRoomList(state.rooms);
  } catch (err) {
    console.error("Failed to load rooms:", err);
    roomList.innerHTML = `<li>Error loading rooms</li>`;
  }
}

// ---------------- RENDER ROOM LIST ----------------
function renderRoomList(rooms) {
  const roomList = UI.roomList();
  if (!roomList) return;

  roomList.innerHTML = "";

  if (!rooms.length) {
    roomList.innerHTML = `<li>No rooms available</li>`;
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.className = "room-item";

    const isOwner =
      state.user &&
      room.createdBy.toLowerCase() === state.user.username.toLowerCase();

    li.innerHTML = `
      <div class="block">
        <h4 class="h6 fw-semibold mb-1">${room.name}</h4>
        <p class="mb-0 text-muted small">Created by: ${room.createdBy}</p>
      </div>
      ${
        isOwner
          ? `<button class="delete-btn btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width:42px;height:42px">
              <i class="fa-solid fa-trash"></i>
            </button>`
          : ""
      }
    `;

    // Click to join room
    li.addEventListener("click", () => {
      if (state.currentRoomId === room.id.toString()) return; // already in room

      const popup = UI.confirmPopup();
      const popupText = UI.popupText();
      popupText.innerHTML = `Do you want to join the room <b>${room.name}</b>?`;
      popup.dataset.action = "join";
      popup.dataset.roomId = room.id;
      popup.dataset.roomName = room.name;
      popup.style.display = "flex";
    });

    // Delete button
    const delBtn = li.querySelector(".delete-btn");
    if (delBtn) {
      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          await deleteRoom(room.id);
        } catch (err) {
          console.error("Delete room failed:", err.message);
          alert(err.message);
        }
      });
    }

    // Highlight active room
    if (state.currentRoomId === room.id.toString()) {
      li.classList.add("active-room");
    }

    roomList.appendChild(li);
  });
}

// ---------------- SETUP ROOM EVENTS ----------------
export function setupRoomEvents() {
  const form = UI.createRoomForm();
  const input = UI.inputRoomName();
  if (!form || !input) return;

  // Create room
  if (!form.dataset.listener) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) return;

      try {
        await createRoom(name);
        input.value = "";
      } catch (err) {
        console.error("Create room failed:", err.message);
        alert(err.message);
      }
    });
    form.dataset.listener = "true";
  }

  // Sync room list when server emits refreshRooms
  socket.off("refreshRooms").on("refreshRooms", loadRooms);
}
