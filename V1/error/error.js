document.addEventListener("DOMContentLoaded", () => {
  const loadingState = document.getElementById("loading");
  const errorState = document.getElementById("error");
  const emptyState = document.getElementById("empty");
  const dataState = document.getElementById("data");
  const dataContent = document.getElementById("data-content");

  const difficulty = localStorage.getItem("examDifficulty");
  const examType = localStorage.getItem("examType");

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    document.getElementById("user-name-text").innerText =
      user.firstName + " " + user.lastName;
  } else {
    window.location.href = "../users/login/login.html";
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../users/login/login.html";
  }

  showLoading();

  fetch(`../shared/data/${examType}-questions.json`)
    .then((response) => response.json())
    .then((data) => {
      const questions = data.questions[difficulty] || [];
      const loggedInUserEmail = localStorage.getItem("logedin");
      if (!loggedInUserEmail) {
        throw new Error("No logged-in user found");
      }
      if (questions.length === 0) {
        showEmpty();
      } else {
        const exam = new Exam(loggedInUserEmail, questions);
        document.getElementById("exam-container").classList.remove("d-none");
        renderExam(exam);
        startTimer(180, document.getElementById("timer"), exam);
        showData(questions);
      }
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
      showError();
    });

  function showLoading() {
    loadingState.classList.remove("d-none");
    errorState.classList.add("d-none");
    emptyState.classList.add("d-none");
    dataState.classList.add("d-none");
  }

  function showError() {
    loadingState.classList.add("d-none");
    errorState.classList.remove("d-none");
    emptyState.classList.add("d-none");
    dataState.classList.add("d-none");
  }

  function showEmpty() {
    loadingState.classList.add("d-none");
    errorState.classList.add("d-none");
    emptyState.classList.remove("d-none");
    dataState.classList.add("d-none");
  }

  function showData(data) {
    loadingState.classList.add("d-none");
    errorState.classList.add("d-none");
    emptyState.classList.add("d-none");
    dataState.classList.remove("d-none");

    dataContent.innerHTML = data.map((item) => `<p>${item}</p>`).join("");
  }
});
