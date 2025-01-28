document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("logedin"));
  if (user) {
    document.getElementById("user-name-text").innerText =
      user.firstName + " " + user.lastName;
    loadResults(user.email);
  } else {
    window.location.href = "../../users/login/login.html";
  }
});

function loadResults(userEmail) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === userEmail);
  if (user && user.exams) {
    const resultsTableBody = document.getElementById("results-table-body");
    user.exams.forEach((exam, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(exam.date).toLocaleDateString()}</td>
        <td>${exam.score}</td>
        <td>${exam.total}</td>
        <td>${((exam.score / exam.total) * 100).toFixed(2)}%</td>
        <td><button class="btn btn-primary" onclick="viewCorrectAnswers(${index})">Correct Answers</button></td>
      `;
      resultsTableBody.appendChild(row);
    });
  }
}

function viewCorrectAnswers(examIndex) {
  localStorage.setItem("examIndex", examIndex);
  window.location.href = "./correct_answers/correct.html";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../../users/login/login.html";
}
