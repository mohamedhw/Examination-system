// GET all the user
export default function getUsers() {
  const storedUsers = localStorage.getItem('users');
  const parsedData = JSON.parse(storedUsers);
  return parsedData;
}
