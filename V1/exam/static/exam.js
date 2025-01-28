import User from "../../users/static/user.js";
localStorage.removeItem("flags");

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
    this.currentQIndex = 0;
    this.score = 0;
    this.answers = new Array(questions.length).fill(null);
    this.startTime = new Date().getTime();
    this.duration = 180 * 1000;
  }

  getTimeLeft() {
    const currentTime = new Date().getTime();
    const timeTaken = currentTime - this.startTime;
    return Math.max(0, this.duration - timeTaken);
  }

  saveExamState() {
    const examState = {
      userEmail: this.userEmail,
      questions: this.questions,
      currentQIndex: this.currentQIndex,
      score: this.score,
      answers: this.answers,
      startTime: this.startTime,
    };
    localStorage.setItem("currentExam", JSON.stringify(examState));
  }

  static loadExamState() {
    const examState = JSON.parse(localStorage.getItem("currentExam"));
    if (!examState) return null;

    const exam = new Exam(examState.userEmail, examState.questions);
    exam.currentQIndex = examState.currentQIndex;
    exam.score = examState.score;
    exam.answers = examState.answers;
    exam.startTime = examState.startTime;
    return exam;
  }

  goToQuestionById(Id) {
    const index = this.questions.findIndex((q) => q.id === Id);
    this.currentQIndex = index;
  }

  getCurrentQuestion() {
    return this.questions[this.currentQIndex];
  }

  nextQuestion() {
    if (this.currentQIndex < this.questions.length - 1) {
      this.currentQIndex++;
      return true;
    }
    return false;
  }

  previousQuestion() {
    if (this.currentQIndex > 0) {
      this.currentQIndex--;
      return true;
    }
    return false;
  }

  answerQuestion(userAnswer) {
    const currentQuestion = this.getCurrentQuestion();
    const questionIndex = this.currentQIndex;
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
    // Get the users array and logged in user
    const users = User.getUsers();
    const loggedInUser = JSON.parse(localStorage.getItem("logedin"));

    if (loggedInUser) {
      // Initialize exams array if it doesn't exist
      if (!Array.isArray(loggedInUser.exams)) {
        loggedInUser.exams = [];
      }

      // Add new exam
      loggedInUser.exams.push({
        score: this.score,
        total: this.questions.length,
        date: new Date().toISOString(),
        answers: this.answers,
      });

      // Update the logged in user in localStorage
      localStorage.setItem("logedin", JSON.stringify(loggedInUser));

      // Find and update the user in the users array
      const userIndex = users.findIndex(u => u.email === loggedInUser.email);
      if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
  }

}

let timerInterval;
document.addEventListener("DOMContentLoaded", () => {
  const difficulty = localStorage.getItem("examDifficulty");
  const examType = localStorage.getItem("examName");
  fetch(`../../shared/data/${examType}.json`)
    .then((response) => response.json())
    .then((data) => {
      const questions = data.questions[difficulty] || [];
      const loggedInUserEmail = localStorage.getItem("logedin");
      if (!loggedInUserEmail) {
        throw new Error("No logged-in user found");
      }
      let exam = Exam.loadExamState();

      if (!exam) {
        localStorage.removeItem("currentExam");
        exam = new Exam(loggedInUserEmail, questions.sort(() => Math.random() - 0.5));
      }

      document.getElementById("exam-container").classList.remove("d-none");
      renderExam(exam);
      startTimer(180, document.getElementById("timer"), exam);
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
      alert("Failed to load questions. Please try again.");
      location.assign("../users/login.html");
    });
});

function renderExam(exam) {
  const currentQuestion = exam.getCurrentQuestion();
  const questionIndex = exam.currentQIndex;
  document.getElementById("question-text").innerText = `Question ${questionIndex + 1
    }: ${currentQuestion.questionText}`;
  const flagIcon = document.getElementById("flag");
  flagIcon.style.color = currentQuestion.flag.flag ? "red" : "var(--accent)";
  flagIcon.onclick = () => {
    currentQuestion.toggleFlag();
    renderExam(exam);
    renderFlaggedQuestions(exam);
  };
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.innerText = option;
    if (exam.answers[questionIndex] === option) {
      optionElement.style.backgroundColor = "lightblue";
      optionElement.style.color = "#000";
    }
    optionElement.onclick = () => {
      exam.answerQuestion(option);
      exam.saveExamState();
      renderExam(exam);
    };
    optionsContainer.appendChild(optionElement);
  });



  const subBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  prevBtn.disabled = questionIndex === 0;
  nextBtn.disabled = questionIndex === exam.questions.length - 1;
  subBtn.classList.toggle(
    "d-none",
    questionIndex !== exam.questions.length - 1
  );
  prevBtn.onclick = () => {
    exam.previousQuestion();
    renderExam(exam);
  };
  nextBtn.onclick = () => {
    exam.nextQuestion();
    renderExam(exam);
  };
  subBtn.onclick = () => {
    exam.storeResults();
    localStorage.removeItem("currentExam");
    location.assign(`../result/result.html`);
  };
  renderFlaggedQuestions(exam);
  exam.saveExamState();

}

function renderFlaggedQuestions(exam) {
  const flaggedQuestionsContainer =
    document.getElementById("flagged-questions");
  flaggedQuestionsContainer.innerHTML = "";
  exam.questions.forEach((question) => {
    if (question.flag.flag) {
      const flaggedQuestion = document.createElement("div");
      flaggedQuestion.classList =
        "d-flex justify-content-center align-items-center";
      flaggedQuestion.innerHTML = `<p class="flag-b d-flex justify-content-between align-items-center w-75">Question ${question.id}<span class="text-end"><i id="rm-flag" class="bi bi-x-square-fill"></i><span></p>`;
      flaggedQuestion.onclick = (e) => {
        if (e.target.id === "rm-flag") {
          question.flag.toggleFlag();
          flaggedQuestion.innerHTML = "";
          renderExam(exam);
        } else {
          exam.goToQuestionById(question.id);
          renderExam(exam);
        }
      };
      flaggedQuestionsContainer.appendChild(flaggedQuestion);
    }
  });
}


function startTimer(duration, display, exam) {
  const startTime = exam.startTime; // Get the start time from the exam object
  const endTime = startTime + duration * 1000; // Calculate the end time

  timerInterval = setInterval(() => {
    const currentTime = new Date().getTime(); // Get the current time
    const timeLeft = Math.max(0, endTime - currentTime); // Calculate the remaining time

    const minutes = Math.floor(timeLeft / 60000); // Convert milliseconds to minutes
    const seconds = Math.floor((timeLeft % 60000) / 1000); // Convert remaining milliseconds to seconds

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    display.innerHTML = `<i class="bi bi-clock me-2"></i>Time Left: ${formattedMinutes}:${formattedSeconds}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      const grade = exam.calculateGrade();
      exam.storeResults();
      const userName = localStorage.getItem("userName");
      const modal = document.getElementById("timeoutModal");
      localStorage.removeItem("flags");
      localStorage.removeItem("currentExam");
      modal.style.display = "block";

      setTimeout(() => {
        location.assign(`../timeout/timeout.html?grade=${grade}&name=${userName}`);
      }, 5000); // 5000 milliseconds = 5 seconds
    } else {
      document.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && timeLeft > 0) {
          try {
            document.getElementById("next-btn").click();
          } catch {
            document.getElementById("submit-btn").click();
          }
        }
      });
    }
  }, 1000);
}


