export const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://YOUR-BACKEND-DOMAIN.com"; // change when deploying

export const SOCKET_URL = API_BASE_URL;
