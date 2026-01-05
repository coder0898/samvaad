import { state } from "./state.js";

const BaseURL = import.meta.env.VITE_BACKEND_URL;

export async function fetchRooms() {
  const res = await fetch(`${BaseURL}/rooms`, {
    headers: { Authorization: `Bearer ${state.token}` },
  });
  return await res.json();
}

export async function createRoom(name) {
  const res = await fetch(`${BaseURL}/rooms`, {
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
  const res = await fetch(`${BaseURL}/rooms/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${state.token}` },
  });
  return await res.json();
}

export async function fetchProfile() {
  const res = await fetch(`${BaseURL}/profile`, {
    headers: { Authorization: `Bearer ${state.token}` },
  });
  return await res.json();
}
