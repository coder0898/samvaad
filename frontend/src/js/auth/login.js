import { isLoginFieldEmpty } from "./util.js";

const BaseURL = ` https://samvaad-r7bw.onrender.com`;

export function initLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const loginUserName = document.getElementById("loginUserName");
  const loginUserPassword = document.getElementById("loginUserPassword");
  const loginError = document.getElementById("loginError");

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
        loginError.innerText = data.message || "Login failed";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "chat.html";
    } catch (err) {
      loginError.innerText = "Login error: " + err.message;
      console.error(err);
    }
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginUserName.value.trim();
    const password = loginUserPassword.value.trim();

    if (isLoginFieldEmpty(username, password)) {
      loginError.innerText = "Please enter both username and password";
      return;
    }

    sendLoginDetails(username, password);
  });
}
