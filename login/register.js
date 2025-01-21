import getUsers from "./users.js"

// Adding a new user
function addUser(newUser) {
  let exist = false;

  getUsers.forEach(element => {
    if (user.email === newUser.email) {
      exist = true;
      return;
    }
  });

  if (!exist) {
    usersArray.push(newUser);
    localStorage.setItem('users', JSON.stringify(usersArray));
  }

}
