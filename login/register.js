import getUsers from "./users.js"

const signUp = document.getElementById("sign-up");

// Adding a new user
function addUser(newUser) {
  let exist = false;
  const users = getUsers();
  console.log(users);
  users.forEach(user => {
    if (user.email === newUser.email) {
      exist = true;
      return;
    }
  });
  console.log(exist);
  if (!exist) {
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    // Toggle visibility of forms
    const registerContainer = document.getElementById("register");
    const loginContainer = document.getElementById("login");

    // Hide registration form
    registerContainer.classList.add("hide");
    // Show login form
    loginContainer.classList.remove("hide");
    loginContainer.classList.add("row");
  }

}

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

  const user = {
    firstname: fName,
    lastname: lName,
    email: email,
    password: password
  }

  addUser(user)
})
