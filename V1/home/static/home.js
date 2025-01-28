import User from "../../users/static/user.js";
const user = JSON.parse(localStorage.getItem("logedin"));


if (user) {
  localStorage.removeItem("flags");
  localStorage.removeItem("currentExam");
  document.getElementById("user-name-text").innerText =
    user.firstName + " " + user.lastName;
} else {
  window.location.href = "../../users/login/login.html";
}

const exams = ["html", "css", "javascript"];

function addExam(exams) {
  const cardContainer = document.getElementById("card-contaner");

  exams.forEach(element => {
    const card = document.createElement("div");
    card.classList = "col-md-4";
    card.innerHTML = `
      <div class="card animate-fade-in">
        <div class="card-body text-center">
          <h5 class="card-title">${element} Exam</h5>
          <select id="${element}-difficulty" class="form-select mb-3">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button class="btn btn-primary start-exam-btn">
            Start Exam
          </button>
        </div>
      </div>`;
    cardContainer.appendChild(card);
    const button = card.querySelector(".start-exam-btn");
    button.addEventListener("click", () => startExam(element));
  });
}

function startExam(type) {
  localStorage.removeItem("flags");
  localStorage.removeItem("currentExam");
  const difficulty = document.getElementById(`${type}-difficulty`).value;
  localStorage.setItem("examName", type);
  localStorage.setItem("examDifficulty", difficulty);
  window.location.href = "../../exam/exam.html";
}

//////////////////////////////// LOGOUT ////////////////////////////

function logOut() {
  User.logout();
  location.assign("../../users/login/login.html");
}

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.onclick = logOut;

addExam(exams);
