import User from "../static/user.js";

const signIn = document.getElementById("sign-in");

signIn.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(signIn);
  const email = formData.get("email");
  const password = formData.get("password");

  const user = User.validateLogin(email, password);
  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "../../home/home.html";
  } else {
    alert("Invalid email or password.");
  }
});
