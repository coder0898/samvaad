// login.js
import { isLoginFieldEmpty } from "./util.js";

const BaseURL = import.meta.env.VITE_BACKEND_URL;

let loginErrorTimeout; // global timeout tracker

export function initLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const loginUserName = document.getElementById("loginUserName");
  const loginUserPassword = document.getElementById("loginUserPassword");

  // ----------------- HELPER: SHOW LOGIN ERROR -----------------
  function showLoginError(msg) {
    const loginError = document.getElementById("loginError");
    if (!loginError) return;

    loginError.innerText = msg;

    // clear previous timeout if exists
    if (loginErrorTimeout) clearTimeout(loginErrorTimeout);

    // clear inputs & error after 3 seconds
    loginErrorTimeout = setTimeout(() => {
      loginUserName.value = "";
      loginUserPassword.value = "";
      loginError.innerText = "";
      loginErrorTimeout = null;
    }, 3000);
  }

  // ----------------- SEND LOGIN REQUEST -----------------
  async function sendLoginDetails(username, password) {
    try {
      console.log("Logging in with:", username, password);

      const res = await fetch(`${BaseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showLoginError(data.message || "Login failed");
        return;
      }

      // ✅ Save token & user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ SPA: show chat page
      if (typeof window.showChatPage === "function") {
        window.showChatPage();

        // ✅ Lazy-load chat module only once
        if (typeof window.startChatApp === "function") {
          await window.startChatApp();
        } else {
          console.warn("startChatApp() not found!");
        }
      } else {
        console.warn("showChatPage() not found!");
      }

      loginUserName.value = "";
      loginUserPassword.value = "";
    } catch (err) {
      showLoginError("Login error: " + err.message);
      console.error(err);
    }
  }

  // ----------------- FORM SUBMIT -----------------
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = loginUserName.value.trim();
    const password = loginUserPassword.value.trim();

    if (isLoginFieldEmpty(username, password)) {
      showLoginError("Please enter both username and password");
      return;
    }

    sendLoginDetails(username, password);
  });
}
