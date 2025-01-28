export default class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.exams = [];
  }


  /**
    * 
    * add the new user to the users.
  */
  saveToLocalStorage() {
    const users = User.getUsers();
    users.push(this);
    localStorage.setItem("users", JSON.stringify(users));
  }

  /**
   * check if a user LogedIn or not
   */
  static checkLogedIn() {
    if (localStorage.getItem("logedin")) {
      location.assign("../../home/home.html");
    }
  }

  /**
   * 
   * @returns array
  */
  static getUsers() {
    const storedUsers = localStorage.getItem("users");
    return JSON.parse(storedUsers) || [];
  }

  /**
   * check if user exists
   * 
   * @param {string} email 
   * @returns boolean
  */
  static userExists(email) {
    return User.getUsers().some((user) => user.email === email);
  }

  /**
   * 
   * validate the login
   * @param {string} email 
   * @param {string} password 
   * @returns object || null
  */
  static validateLogin(email, password) {
    const users = User.getUsers();
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem("logedin", JSON.stringify(user));
    }
    return user || null;
  }

  static logout() {
    localStorage.removeItem("flags");
    localStorage.removeItem("currentExam");
    localStorage.removeItem("examDifficulty");
    localStorage.removeItem("examIndex");
    localStorage.removeItem("examName");
    localStorage.removeItem("logedin");
  }

}
