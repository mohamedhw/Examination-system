export default class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.exams = {}; // Store exam names and scores
  }

  // Save the user to local storage
  saveToLocalStorage() {
    const users = User.getUsers();
    users.push(this);
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Get all users from local storage
  static getUsers() {
    const storedUsers = localStorage.getItem('users');
    return JSON.parse(storedUsers) || [];
  }

  // Check if user exists
  static userExists(email) {
    return User.getUsers().some(user => user.email === email);
  }

  // Validate user credentials
  static validateLogin(email, password) {
    const users = User.getUsers();
    return users.find(user => user.email === email && user.password === password) || null;
  }
}

