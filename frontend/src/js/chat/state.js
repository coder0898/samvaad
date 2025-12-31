export const state = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  rooms: [],
  currentRoomId: null,
  currentRoomName: null,
  messages: [],
  hasJoined: false,
  socketInitialized: false, // flag to prevent multiple socket connections
};
