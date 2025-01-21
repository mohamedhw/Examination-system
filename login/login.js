import getUsers from "./users.js"

const signIn = document.getElementById("sign-in");

// login function
function login(userEmail, userPassword) {
  const users = getUsers();

  if (users) {

    users.forEach(user => {
      if (user.email === userEmail && user.password === userPassword) {
        userEmail = user.email;
        console.log(user)
        return;
      }
    });

    return true;
  } else {

    console.log('Key does not exist in localStorage.');
    return false;

  }
}

signIn.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(signIn);
  const email = formData.get('email');
  const password = formData.get('password');
  login(email, password)
})
