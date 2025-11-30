import { state } from "./state.js";

const BASE = "http://localhost:5000";

export async function fetchRooms() {
  const res = await fetch(`${BASE}/rooms`, {
    headers: { Authorization: `Bearer ${state.token}` },
  });
  return await res.json();
}

export async function createRoom(name) {
  const res = await fetch(`${BASE}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.token}`,
    },
    body: JSON.stringify({ name }),
  });
  return await res.json();
}

export async function deleteRoom(id) {
  const res = await fetch(`${BASE}/rooms/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${state.token}` },
  });
  return await res.json();
}

export async function fetchProfile() {
  const res = await fetch(`${BASE}/profile`, {
    headers: { Authorization: `Bearer ${state.token}` },
  });
  return await res.json();
}
