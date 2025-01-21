import User from "./user.js";

const signIn = document.getElementById("sign-in");

signIn.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(signIn);
  const email = formData.get('email');
  const password = formData.get('password');

  const user = User.validateLogin(email, password);
  if (user) {
    console.log("Login successful for:", user);
    // Redirect to another page or proceed
  } else {
    alert("Invalid email or password.");
  }
});

