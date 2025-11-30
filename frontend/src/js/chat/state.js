export const state = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
  roomData: [],
  currentRoomId: null,
  currentRoomName: null,
  hasJoined: false,
  messages: [],
};
