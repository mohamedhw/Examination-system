import User from "../static/user.js";

User.checkLogedIn();

const signIn = document.getElementById("sign-in");
const emailField = document.getElementById("exampleInputEmail1");
const passwordField = document.getElementById("exampleInputPassword1");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function clearErrors() {
  emailError.textContent = "";
  passwordError.textContent = "";
  emailField.classList.remove("is-invalid");
  passwordField.classList.remove("is-invalid");
}

signIn.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(signIn);
  const email = formData.get("email");
  const password = formData.get("password");

  let isValid = true;

  // Validate email
  if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email address.";
    emailField.classList.add("is-invalid");
    isValid = false;
  }

  // Validate password
  if (!password) {
    passwordError.textContent = "Password cannot be empty.";
    passwordField.classList.add("is-invalid");
    isValid = false;
  }

  if (!isValid) return;

  const user = User.validateLogin(email, password);
  if (user) {
    window.location.assign("../../home/home.html");
  } else {
    emailError.textContent = "Invalid email or password.";
    passwordError.textContent = "Invalid email or password.";
    emailField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
  }
});

emailField.addEventListener("input", () => {
  if (validateEmail(emailField.value)) {
    emailError.textContent = "";
    emailField.classList.remove("is-invalid");
  }
});

passwordField.addEventListener("input", () => {
  if (passwordField.value) {
    passwordError.textContent = "";
    passwordField.classList.remove("is-invalid");
  }
});

