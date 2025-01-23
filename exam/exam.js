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
    this.flag = Flag.getFlagState(id) || false; // Initialize from localStorage if available
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
      const flagsString = localStorage.getItem("flags");
      const flags = flagsString ? JSON.parse(flagsString) : {};
      flags[id] = flag;
      localStorage.setItem("flags", JSON.stringify(flags));
    } catch {
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
      (q) => new Question(q.id, q.question, q.options, q.correctAnswer, q.explanation)
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

fetch("../shared/data/javascript-questions.json")
  .then((response) => response.json())
  .then((data) => {
    const questions = data.questions.easy || [];
    const loggedInUserEmail = localStorage.getItem("logedin");
    if (!loggedInUserEmail) {
      throw new Error("No logged-in user found");
    }
    const exam = new Exam(loggedInUserEmail, questions);
    renderExam(exam);
  })
// .catch((error) => console.error("Error loading questions:", error))

function renderExam(exam) {
  const currentQuestion = exam.getCurrentQuestion();
  flagChange(exam)
  const questionIndex = exam.currentQuestionIndex;
  // Render question text
  const questionEl = document.getElementById("question-text")
  questionEl.innerText = currentQuestion.questionText;

  const flag = document.getElementById("flag")
  const flags = document.getElementsByClassName("flag")

  flag.setAttribute("value", currentQuestion.id);

  flag.onclick = () => {
    currentQuestion.toggleFlag();
    flagChange(exam);
    renderExam(exam)
  }

  for (let i = 0; i < flags.length; i++) {
    flags[i].addEventListener("click", function () {
      exam.goToQuestionById(flags[i].getAttribute("value"))
      renderExam(exam)
    })
  };



  // Render options
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const optionElement = document.createElement("h5");
    optionElement.className = "mt-3 p-3";
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

  // Render navigation
  const navigationContainer = document.getElementById("navigation-container");
  navigationContainer.innerHTML = "";

  const createButton = (text, disabled, onClick) => {
    const button = document.createElement("button");
    button.innerText = text;
    button.disabled = disabled;
    button.onclick = onClick;
    return button;
  };

  const leftArrow = createButton("←", questionIndex === 0, () => {
    exam.previousQuestion();
    renderExam(exam);
  });

  const rightArrow = createButton(
    "→",
    questionIndex === exam.questions.length - 1,
    () => {
      exam.nextQuestion();
      renderExam(exam);
    }
  );

  navigationContainer.appendChild(leftArrow);
  navigationContainer.appendChild(rightArrow);

  if (questionIndex === exam.questions.length - 1) {
    const submitButton = createButton("Submit", false, () => {
      exam.storeResults();
      localStorage.setItem("flags", "{}")
      console.log(`Exam Score: ${exam.score}`);
      location.assign("./success/success.html");
    });
    navigationContainer.appendChild(submitButton);
  }
}



function flagChange(exam) {
  const side = document.getElementById("side");
  side.innerHTML = ""

  for (let i = 0; i < exam.questions.length; i++) {
    if (exam.questions[i].flag.flag) {
      const flagEl = document.createElement("p");
      flagEl.setAttribute("value", exam.questions[i].id);
      flagEl.classList.add("flag");
      flagEl.classList.add("m-3");
      flagEl.innerText = `Flag ${exam.questions[i].id}`;
      side.appendChild(flagEl);
    }
  }
}

