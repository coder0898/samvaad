import "bootstrap/dist/css/bootstrap.min.css";

let chatInitialized = false;

window.startChatApp = async function () {
  if (chatInitialized) return;

  const { initChat } = await import("./js/chat/chat.js");
  initChat();
  chatInitialized = true;
};

// -------------------- PAGE ELEMENTS --------------------
function getPages() {
  const authPage = document.getElementById("authPage");
  const chatPage = document.getElementById("chatPage");
  if (!authPage || !chatPage) return null;
  return { authPage, chatPage };
}

window.addEventListener("DOMContentLoaded", async () => {
  const pages = getPages();
  if (!pages) {
    console.error("Auth or Chat page not found!");
    return;
  }

  const { authPage, chatPage } = pages;

  // -------------------- SPA PAGE SWITCH --------------------
  function showAuthPage() {
    authPage.classList.add("active");
    chatPage.classList.remove("active");
    document.body.dataset.page = "auth";
  }

  function showChatPage() {
    chatPage.classList.add("active");
    authPage.classList.remove("active");
    document.body.dataset.page = "chat";
  }

  // Expose globally
  window.showAuthPage = showAuthPage;
  window.showChatPage = showChatPage;

  // -------------------- TOKEN CHECK --------------------
  const token = localStorage.getItem("token");
  if (token) {
    showChatPage();
    await window.startChatApp();
  } else {
    showAuthPage();
  }

  // -------------------- LAZY LOAD AUTH MODULES --------------------
  const { initTab } = await import("./js/auth/tab.js");
  const { initSignup } = await import("./js/auth/signup.js");
  const { initLogin } = await import("./js/auth/login.js");

  initTab();
  initSignup();
  initLogin();
});
