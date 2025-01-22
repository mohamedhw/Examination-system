import User from "../users/user.js";

class Question {
  constructor(id, questionText, options, correctAnswer, explanation) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
    this.explanation = explanation;
  }

  isCorrect(userAnswer) {
    return userAnswer === this.correctAnswer;
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
  .catch((error) => console.error("Error loading questions:", error));

function renderExam(exam) {
  const currentQuestion = exam.getCurrentQuestion();
  const questionIndex = exam.currentQuestionIndex;

  // Render question text
  const questionEl = document.getElementById("question-text")
  questionEl.innerText = currentQuestion.questionText;
  const flag = document.getElementById("flag")
  const flags = document.getElementsByClassName("flag")

  flag.setAttribute("value", currentQuestion.id);
  flag.onclick = () => addFlag(currentQuestion);

  for (let i = 0; i < flags.length; i++) {
    flags[i].onclick = exam.goToQuestionById(flags[i].value);
  }


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
      console.log(`Exam Score: ${exam.score}`);
      location.assign("./success/success.html");
    });
    navigationContainer.appendChild(submitButton);
  }
}



function addFlag(question) {
  const side = document.getElementById("side");
  const flags = document.getElementsByClassName("flag");

  // the flag exists
  let flagExists = false;
  for (let i = 0; i < flags.length; i++) {
    if (flags[i].getAttribute("value") === question.id) {
      flagExists = true;
      break;
    }
  }

  // flag doesn't exist
  if (!flagExists) {
    const flagEl = document.createElement("p");
    flagEl.setAttribute("value", question.id);
    flagEl.classList.add("flag");
    flagEl.classList.add("m-3");
    flagEl.innerText = `Flag ${question.id}`;
    side.appendChild(flagEl);
  } else {
    console.log(`Flag for question ${question.id} already exists.`);
  }
}

