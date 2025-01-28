import User from "../users/static/user.js";

const users = User.getUsers();
const user = users.find((u) => u.email === localStorage.getItem("logedin"));

const exam = user.exams[user.exams.length - 1];
const scorePercentage = (exam.score / exam.total) * 100;
const gif = document.getElementById("thumb");
const username = document.getElementById("user-name");
const grade = document.getElementById("grade-text");

if (user) {
  console.log(user.firstName);
  if (scorePercentage > 50) {
    gif.src = "../static/images/success.gif";
    username.textContent = `Congratulations ${user.firstName} ${user.lastName}!`;
    grade.textContent = `Your grade is ${scorePercentage}%`;
  } else if (scorePercentage < 50) {
    gif.src = "../static/images/sorry.jpg";
    username.textContent = `Sorry ${user.firstName} ${user.lastName}, You failed in this Exam`;
    grade.textContent = `Your grade is ${scorePercentage}%`;
  }
  const stars = scoreToStars(scorePercentage, 100, 5);
  console.log("stars", stars);
  displayStars(stars);
}

function scoreToStars(score, maxScore, maxStars) {
  const starRating = (score / maxScore) * maxStars;
  return starRating;
}

function displayStars(stars) {
  const starContainer = document.getElementById("starRating");
  starContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(stars)) {
      starContainer.innerHTML += '<i class="bi bi-star-fill m-1"></i>'; // Full star
    } else if (i < stars) {
      starContainer.innerHTML += '<i class="bi bi-star-half m-1"></i>'; // Half star
    } else {
      starContainer.innerHTML += '<i class="bi bi-star m-1"></i>'; // Empty star
    }
  }
  console.log(starContainer);
}
