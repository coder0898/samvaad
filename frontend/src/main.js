// main.js
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

window.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  const token = localStorage.getItem("token");

  // Auth pages
  if (page === "auth") {
    if (token) {
      window.location.replace("chat.html");
      return;
    }

    // Lazy load only auth modules
    const { initTab } = await import("./js/auth/tab.js");
    const { initSignup } = await import("./js/auth/signup.js");
    const { initLogin } = await import("./js/auth/login.js");

    initTab();
    initSignup();
    initLogin();
    return;
  }

  // Chat page
  if (page === "chat") {
    if (!token) {
      window.location.replace("index.html");
      return;
    }

    // Lazy load only chat module
    const { initChat } = await import("./js/chat/chat.js");
    initChat();
  }
});
