// // // main.js
// // import "./style.css";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import "bootstrap/dist/js/bootstrap.bundle.min.js";

// // window.addEventListener("DOMContentLoaded", async () => {
// //   const page = document.body.dataset.page;
// //   const token = localStorage.getItem("token");

// //   // Auth pages
// //   if (page === "auth") {
// //     if (token) {
// //       window.location.replace("chat.html");
// //       return;
// //     }

// //     // Lazy load only auth modules
// //     const { initTab } = await import("./js/auth/tab.js");
// //     const { initSignup } = await import("./js/auth/signup.js");
// //     const { initLogin } = await import("./js/auth/login.js");

// //     initTab();
// //     initSignup();
// //     initLogin();
// //     return;
// //   }

// //   // Chat page
// //   if (page === "chat") {
// //     if (!token) {
// //       window.location.replace("index.html");
// //       return;
// //     }

// //     // Lazy load only chat module
// //     const { initChat } = await import("./js/chat/chat.js");
// //     initChat();
// //   }
// // });

// // main.js
// import "./style.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// const authPage = document.getElementById("authPage");
// const chatPage = document.getElementById("chatPage");

// console.log(authPage, chatPage); // Should log the elements now

// export function showChatPage() {
//   if (!authPage || !chatPage) return;
//   authPage.hidden = true;
//   chatPage.hidden = false;
//   document.body.dataset.page = "chat";
// }

// export function showAuthPage() {
//   if (!authPage || !chatPage) {
//     console.log("you are not here", authPage, chatPage);
//     return;
//   }

//   console.log("working ");
//   document.body.dataset.page = "auth";
//   chatPage.hidden = true;
//   authPage.hidden = false;
//   console.log("switching");
// }

// window.addEventListener("DOMContentLoaded", async () => {
//   const page = document.body.dataset.page;
//   const token = localStorage.getItem("token");

//   // ================= AUTH =================
//   if (page === "auth") {
//     if (token) {
//       showChatPage(); // ✅ FIX (no navigation)
//     }

//     // Lazy load only auth modules
//     const { initTab } = await import("./js/auth/tab.js");
//     const { initSignup } = await import("./js/auth/signup.js");
//     const { initLogin } = await import("./js/auth/login.js");

//     initTab();
//     initSignup();
//     initLogin();
//     return;
//   }

//   // ================= CHAT =================
//   if (page === "chat") {
//     if (!token) {
//       showAuthPage(); // ✅ FIX (no navigation)
//       return;
//     }

//     // Lazy load only chat module
//     const { initChat } = await import("./js/chat/chat.js");
//     initChat();
//   }
// });

// main.js
// import "./style.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// window.addEventListener("DOMContentLoaded", async () => {
//   // -------------------- PAGE ELEMENTS --------------------
//   const authPage = document.querySelector("#authPage");
//   const chatPage = document.querySelector("#chatPage");

//   // -------------------- SPA SWITCH FUNCTIONS --------------------
//   function showAuthPage() {
//     console.log("authPage:", authPage, "chatPage:", chatPage);
//     if (!authPage || !chatPage) return;

//     console.log("switching");
//     document.body.dataset.page = "auth";
//     authPage.classList.add("active");
//     chatPage.classList.remove("active");
//     console.log("switched");
//   }

//   function showChatPage() {
//     if (!authPage || !chatPage) return;

//     document.body.dataset.page = "chat";
//     chatPage.classList.add("active");
//     authPage.classList.remove("active");
//   }

//   // Expose globally if needed in other modules
//   window.showAuthPage = showAuthPage;
//   window.showChatPage = showChatPage;

//   // -------------------- TOKEN CHECK --------------------
//   const token = localStorage.getItem("token");

//   if (token) {
//     showChatPage();
//   } else {
//     showAuthPage();
//   }

//   // -------------------- LAZY LOAD AUTH MODULES --------------------
//   const { initTab } = await import("./js/auth/tab.js");
//   const { initSignup } = await import("./js/auth/signup.js");
//   const { initLogin } = await import("./js/auth/login.js");

//   initTab();
//   initSignup();
//   initLogin();

//   // -------------------- LAZY LOAD CHAT MODULE --------------------
//   if (token) {
//     const { initChat } = await import("./js/chat/chat.js");
//     initChat();
//   }

//   // -------------------- LOGOUT --------------------
//   const logoutBtn = document.getElementById("logoutBtn");
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", () => {
//       localStorage.clear();
//       showAuthPage();
//     });
//   }
// });

// main.js
// main.js
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

  // -------------------- LAZY LOAD CHAT MODULE --------------------
  if (token) {
    const { initChat } = await import("./js/chat/chat.js");
    initChat();
  }
});
