import { state } from "../state.js";
import { socket } from "../socket.js";
import { UI } from "../ui.js";
import { fetchRooms, createRoom, deleteRoom } from "../api.js";

// Load all rooms and render UI
export async function loadRooms() {
  const roomList = UI.roomList();
  if (!roomList) return;

  // Show loading immediately
  roomList.innerHTML = `<li class="loading">Loading rooms...</li>`;

  try {
    const data = await fetchRooms();
    state.rooms = data.rooms || [];

    roomList.innerHTML = "";

    if (state.rooms.length === 0) {
      roomList.innerHTML = `<li>No rooms available</li>`;
      return;
    }

    state.rooms.forEach((room) => {
      const li = document.createElement("li");
      li.className = "room-item";
      li.innerHTML = `
        <div class="block">
          <h4>${room.name}</h4>
          <p>${room.createdBy}</p>
        </div>
        ${
          room.createdBy.toLowerCase() === state.user.username.toLowerCase()
            ? `<button class="delete-btn"><i class="fa-solid fa-trash"></i></button>`
            : ""
        }
      `;

      // Click to join room
      li.addEventListener("click", () => {
        const popup = UI.confirmPopup();
        UI.popupText().textContent = "Join this room?";
        popup.dataset.action = "join";
        popup.dataset.roomId = room.id;
        popup.dataset.roomName = room.name;
        popup.style.display = "flex";
      });

      // Delete room (only for creator)
      const delBtn = li.querySelector(".delete-btn");
      if (delBtn) {
        delBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          try {
            await deleteRoom(room.id); // Call backend API
            // Backend emits refreshRooms; no need to manually call loadRooms
          } catch (err) {
            console.error("Delete room failed:", err.message);
            alert(err.message);
          }
        });
      }

      roomList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load rooms:", err);
    roomList.innerHTML = `<li>Error loading rooms</li>`;
  }
}

// Setup create room form and socket sync
export function setupRoomEvents() {
  const form = UI.createRoomForm();
  const input = UI.inputRoomName();

  if (!form || !input) return;

  if (!form.dataset.listener) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) return;

      try {
        await createRoom(name); // Persist room via API
        input.value = "";
        // Backend will emit "refreshRooms", which triggers loadRooms
      } catch (err) {
        console.error("Create room failed:", err.message);
        alert(err.message);
      }
    });

    form.dataset.listener = "true";
  }

  // Sync room list when backend signals updates
  socket.off("refreshRooms").on("refreshRooms", loadRooms);
}
