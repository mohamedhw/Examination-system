// GET all the user
export default function getUsers() {
  console.log("test")
  const storedUsers = localStorage.getItem('users');
  return JSON.parse(storedUsers) || [];
}
