document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    document.getElementById("user-name-text").innerText =
      user.firstName + " " + user.lastName;
  } else {
    window.location.href = "../users/login/login.html";
  }
});

function startExam(type) {
  const difficulty = document.getElementById(`${type}-difficulty`).value;
  localStorage.setItem("examType", type);
  localStorage.setItem("examDifficulty", difficulty);
  window.location.href = "../ready/ready.html";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../users/login/login.html";
}
