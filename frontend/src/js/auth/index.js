import { initTab } from "./tab.js";
import { initLogin } from "./login.js";
import { initSignup } from "./signup.js";

export function initAuth() {
  initTab();
  initLogin();
  initSignup();
}
