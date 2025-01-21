import User from "./user.js";

const signUp = document.getElementById("sign-up");

signUp.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(signUp);
  const fName = formData.get('firstname');
  const lName = formData.get('lastname');
  const email = formData.get('email');
  const password = formData.get('password');
  const password2 = formData.get('password2');

  if (password !== password2) {
    alert("Passwords do not match.");
    return;
  }

  // Check if user already exists
  if (User.userExists(email)) {
    alert("Email already exists.");
    return;
  }

  // Create new user and save to local storage
  const newUser = new User(fName, lName, email, password);
  newUser.saveToLocalStorage();

  // Toggle visibility of forms
  const registerContainer = document.getElementById("register");
  const loginContainer = document.getElementById("login");

  registerContainer.classList.add("hide");
  loginContainer.classList.remove("hide");
  loginContainer.classList.add("row");
});

