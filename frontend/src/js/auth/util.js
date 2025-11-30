export function isFieldEmpty(...fields) {
  return fields.some((f) => f.trim() === "");
}

export function isLoginFieldEmpty(...fields) {
  return fields.some((f) => f.trim() === "");
}

export function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function validatePassword(password) {
  if (password.length < 6 || password.length > 20)
    return "Password must be 6-20 chars";
  if (!/[A-Z]/.test(password))
    return "Password must include an uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must include a lowercase letter";
  if (!/\d/.test(password)) return "Password must include a number";
  if (!/[@$!%*?&]/.test(password))
    return "Password must include a special character";
  return "";
}

export function doPasswordsMatch(pwd, confirmPwd) {
  return pwd === confirmPwd;
}
