import User from "../static/user.js";

const signUp = document.getElementById("sign-up");

User.checkLogedIn();

signUp.addEventListener("submit", function (e) {
  e.preventDefault();

  clearErrors();

  // Get form data
  const formData = new FormData(signUp);
  const fName = formData.get("firstname");
  const lName = formData.get("lastname");
  const email = formData.get("email");
  const password = formData.get("password");
  const password2 = formData.get("password2");

  // Validate inputs
  const isFirstNameValid = validateFirstName(fName);
  const isLastNameValid = validateLastName(lName);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = validateConfirmPassword(password, password2);

  if (isEmailValid && User.userExists(email)) {
    document.getElementById("email-error").textContent = "Email already exists.";
    return;
  }

  if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
    const newUser = new User(fName, lName, email, password);
    newUser.saveToLocalStorage();
    window.location.href = "../login/login.html";
  }
});

///////////////////// Validation Functions ///////////////////////////

function validateFirstName(firstName) {
  const errorElement = document.getElementById("firstname-error");
  if (!firstName.match(/^[A-Za-z]+$/)) {
    errorElement.textContent = "First name must contain only letters.";
    return false;
  }
  return true;
}

function validateLastName(lastName) {
  const errorElement = document.getElementById("lastname-error");
  if (!lastName.match(/^[A-Za-z]+$/)) {
    errorElement.textContent = "Last name must contain only letters.";
    return false;
  }
  return true;
}

function validateEmail(email) {
  const errorElement = document.getElementById("email-error");
  if (!email.match(/[a-zA-Z0-9_%+]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}/)) {
    errorElement.textContent = "Please enter a valid email address.";
    return false;
  }
  return true;
}

function validatePassword(password) {
  const errorElement = document.getElementById("password-error");
  if (!password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/)) {
    errorElement.textContent =
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.";
    return false;
  }
  return true;
}

function validateConfirmPassword(password, confirmPassword) {
  const errorElement = document.getElementById("password2-error");
  if (confirmPassword !== password) {
    errorElement.textContent = "Passwords do not match.";
    return false;
  }
  return true;
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".text-danger");
  errorElements.forEach((element) => (element.textContent = ""));
}
