import {
  isFieldEmpty,
  validatePassword,
  doPasswordsMatch,
  isValidEmail,
} from "./util.js";

export function initSignup() {
  const signupForm = document.getElementById("signupForm");
  if (!signupForm) return;

  const signupUserName = document.getElementById("signupUserName");
  const userEmail = document.getElementById("userEmail");
  const signupUserPassword = document.getElementById("signupUserPassword");
  const signupConfirmPassword = document.getElementById(
    "signupConfirmPassword"
  );
  const signupError = document.getElementById("signupError");

  async function sendSignupData(username, email, password) {
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        signupError.innerText = data.message || "Signup failed";
        return;
      }
      signupError.style.color = "green";
      signupError.innerText = "Signup successful! You can login now.";
    } catch (err) {
      signupError.innerText = "Signup error: " + err.message;
      console.error(err);
    }
  }

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = signupUserName.value.trim();
    const email = userEmail.value.trim();
    const password = signupUserPassword.value.trim();
    const confirmPassword = signupConfirmPassword.value.trim();

    if (isFieldEmpty(username, email, password, confirmPassword)) {
      signupError.innerText = "Please provide all details";
      return;
    }

    const pwdMsg = validatePassword(password);
    if (pwdMsg) {
      signupError.innerText = pwdMsg;
      return;
    }

    if (!doPasswordsMatch(password, confirmPassword)) {
      signupError.innerText = "Passwords do not match";
      return;
    }

    if (!isValidEmail(email)) {
      signupError.innerText = "Invalid email address";
      return;
    }

    sendSignupData(username, email, password);

    // Reset fields
    signupUserName.value = "";
    userEmail.value = "";
    signupUserPassword.value = "";
    signupConfirmPassword.value = "";
  });
}
