export const state = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  rooms: [],
  currentRoomId: null,
  currentRoomName: null,
  messages: [],
  hasJoined: false,
  socketInitialized: false,
  lastLeaveTime: null, // track when user leaves a room
  listenersRegistered: false,
};
