export default class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.exams = []; // يجب أن يكون exams مصفوفة
  }

  // حفظ المستخدم في localStorage
  saveToLocalStorage() {
    const users = User.getUsers();
    users.push(this);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // الحصول على جميع المستخدمين من localStorage
  static getUsers() {
    const storedUsers = localStorage.getItem("users");
    return JSON.parse(storedUsers) || [];
  }

  // التحقق من وجود مستخدم بالبريد الإلكتروني
  static userExists(email) {
    return User.getUsers().some((user) => user.email === email);
  }

  // التحقق من صحة بيانات تسجيل الدخول
  static validateLogin(email, password) {
    const users = User.getUsers();
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      localStorage.setItem("logedin", user.email);
      localStorage.setItem("userName", `${user.firstName} ${user.lastName}`); // حفظ اسم المستخدم
    }
    return user || null;
  }
}
