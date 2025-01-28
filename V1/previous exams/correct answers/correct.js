document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    document.getElementById("user-name-text").innerText =
      user.firstName + " " + user.lastName;
    loadCorrectAnswers(user.email);
  } else {
    window.location.href = "../users/login/login.html";
  }
});

function loadCorrectAnswers(userEmail) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === userEmail);
  const examIndex = localStorage.getItem("examIndex");
  if (user && user.exams && user.exams[examIndex]) {
    const exam = user.exams[examIndex];
    const answersTableBody = document.getElementById("answers-table-body");
    exam.answers.forEach((answer, index) => {
      const question = exam.questions[index];
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${question.questionText}</td>
        <td>${answer}</td>
        <td>${question.correctAnswer}</td>
      `;
      answersTableBody.appendChild(row);
    });
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../users/login/login.html";
}
