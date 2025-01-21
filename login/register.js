

// Adding a new user
function addUser(newUser) {
  const storedUsers = localStorage.getItem('users');
  let usersArray = JSON.parse(storedUsers) || [];
  usersArray.push(newUser);
  localStorage.setItem('users', JSON.stringify(usersArray));
}
