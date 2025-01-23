import User from "../../users/user.js";

const users = User.getUsers();
const user = users.find((u) => u.email === localStorage.getItem("logedin"));

if (user) {
  const exam = user.exams[user.exams.length - 1];
  const scorePercentage = (exam.score / exam.total) * 100;
  const score = document.getElementById("score")
  const value = document.createElement("p")
  value.classList = "lead"
  value.innerText = `Your grade is ${scorePercentage}%`
  score.append(value);
}
