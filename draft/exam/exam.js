// exam.js
import User from "../users/user.js";

class Question {
  constructor(id, questionText, options, correctAnswer, explanation) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
    this.explanation = explanation;
    this.flag = new Flag(id);
  }

  isCorrect(userAnswer) {
    return userAnswer === this.correctAnswer;
  }

  toggleFlag() {
    this.flag.toggleFlag();
  }
}

class Flag {
  constructor(id) {
    this.id = id;
    this.flag = Flag.getFlagState(id) || false;
  }

  static getFlagState(id) {
    try {
      const flags = JSON.parse(localStorage.getItem("flags")) || {};
      return flags[id];
    } catch (error) {
      console.error("Error parsing flags from localStorage:", error);
      return false;
    }
  }

  static setFlagState(id, flag) {
    try {
      const flags = JSON.parse(localStorage.getItem("flags")) || {};
      flags[id] = flag;
      localStorage.setItem("flags", JSON.stringify(flags));
    } catch (error) {
      console.error("Error setting flag state:", error);
    }
  }

  toggleFlag() {
    this.flag = !this.flag;
    Flag.setFlagState(this.id, this.flag);
  }
}

class Exam {
  constructor(userEmail, questions = []) {
    this.userEmail = userEmail;
    this.questions = questions.map(
      (q) =>
        new Question(
          q.id,
          q.question,
          q.options,
          q.correctAnswer,
          q.explanation
        )
    );
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answers = new Array(questions.length).fill(null);
  }

  goToQuestionById(questionId) {
    const index = this.questions.findIndex((q) => q.id === questionId);
    this.currentQuestionIndex = index;
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }

  answerQuestion(userAnswer) {
    const currentQuestion = this.getCurrentQuestion();
    const questionIndex = this.currentQuestionIndex;
    if (this.answers[questionIndex]) {
      if (currentQuestion.isCorrect(this.answers[questionIndex])) {
        this.score--;
      }
    }
    this.answers[questionIndex] = userAnswer;
    if (currentQuestion.isCorrect(userAnswer)) {
      this.score++;
    }
  }

  calculateGrade() {
    return (this.score / this.questions.length) * 100;
  }

  storeResults() {
    const users = User.getUsers();
    const user = users.find((u) => u.email === this.userEmail);

    if (user) {
      user.exams = user.exams || [];
      user.exams.push({
        score: this.score,
        total: this.questions.length,
        date: new Date().toISOString(),
        answers: this.answers,
      });
      localStorage.setItem("users", JSON.stringify(users));
    }
  }
}

// Fetch Questions and Start Exam
document.getElementById("start-exam").addEventListener("click", () => {
  const difficulty = document.getElementById("difficulty").value;
  fetch("../shared/data/javascript-questions.json")
    .then((response) => response.json())
    .then((data) => {
      const questions = data.questions[difficulty] || [];
      const loggedInUserEmail = localStorage.getItem("logedin");
      if (!loggedInUserEmail) {
        throw new Error("No logged-in user found");
      }
      const exam = new Exam(loggedInUserEmail, questions);
      document.getElementById("difficulty-selector").classList.add("d-none");
      document.getElementById("exam-container").classList.remove("d-none");
      renderExam(exam);
    })
    .catch((error) => console.error("Error loading questions:", error));
});

function renderExam(exam) {
  const currentQuestion = exam.getCurrentQuestion();
  const questionIndex = exam.currentQuestionIndex;

  // Render Question Text with Question Number
  document.getElementById("question-text").innerText = `Question ${
    questionIndex + 1
  }: ${currentQuestion.questionText}`;

  // Render Flag Icon
  const flagIcon = document.getElementById("flag");
  flagIcon.style.color = currentQuestion.flag.flag ? "red" : "var(--accent)";
  flagIcon.onclick = () => {
    currentQuestion.toggleFlag();
    renderExam(exam);
    renderFlaggedQuestions(exam);
  };

  // Render Options
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.innerText = option;

    if (exam.answers[questionIndex] === option) {
      optionElement.style.backgroundColor = "lightblue";
    }

    optionElement.onclick = () => {
      exam.answerQuestion(option);
      renderExam(exam);
    };
    optionsContainer.appendChild(optionElement);
  });

  // Render Navigation Buttons
  document.getElementById("prev-btn").disabled = questionIndex === 0;
  document.getElementById("next-btn").disabled =
    questionIndex === exam.questions.length - 1;
  document
    .getElementById("submit-btn")
    .classList.toggle("d-none", questionIndex !== exam.questions.length - 1);

  document.getElementById("prev-btn").onclick = () => {
    exam.previousQuestion();
    renderExam(exam);
  };

  document.getElementById("next-btn").onclick = () => {
    exam.nextQuestion();
    renderExam(exam);
  };

  document.getElementById("submit-btn").onclick = () => {
    const grade = exam.calculateGrade();
    exam.storeResults();
    if (grade >= 50) {
      location.assign(`../success/success.html?grade=${grade}`);
    } else {
      location.assign(`../sorry/sorry.html?grade=${grade}`);
    }
  };

  // Render Timer
  startTimer(600, document.getElementById("timer"), exam);

  // Render Flagged Questions
  renderFlaggedQuestions(exam);
}

function renderFlaggedQuestions(exam) {
  const flaggedQuestionsContainer =
    document.getElementById("flagged-questions");
  flaggedQuestionsContainer.innerHTML = "";

  exam.questions.forEach((question) => {
    if (question.flag.flag) {
      const flaggedQuestion = document.createElement("p");
      flaggedQuestion.innerText = `Question ${question.id}`;
      flaggedQuestion.onclick = () => {
        exam.goToQuestionById(question.id);
        renderExam(exam);
      };
      flaggedQuestionsContainer.appendChild(flaggedQuestion);
    }
  });
}

function startTimer(duration, display, exam) {
  let timer = duration,
    minutes,
    seconds;
  const interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    display.innerHTML = `<i class="bi bi-clock me-2"></i>Time Left: ${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(interval);
      const grade = exam.calculateGrade();
      exam.storeResults();
      location.assign(`../timeout/timeout.html?grade=${grade}`);
    }
  }, 1000);
}
