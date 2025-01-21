const signIn = document.getElementById("sign-in");

// GET all the user
function getUsers() {
  const storedUsers = localStorage.getItem('users');
  const parsedData = JSON.parse(storedUsers);
  return parsedData;
}


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

  } else {

    console.log('Key does not exist in localStorage.');

  }
}

addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(signIn);
  const email = formData.get('email');
  const password = formData.get('password');
  login(email, password)
})
