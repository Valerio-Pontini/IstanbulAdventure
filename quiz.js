const content = window.APP_CONTENT;
const QUESTION_TEXT_MAX_SIZE = 31;
const QUESTION_TEXT_MIN_SIZE = 18;

const ui = {
  quizExperience: document.getElementById("quizExperience"),
  quizCompletion: document.getElementById("quizCompletion"),
  quizQuestionText: document.getElementById("quizQuestionText"),
  quizAnswers: document.getElementById("quizAnswers"),
  quizCompletionText: document.getElementById("quizCompletionText"),
  feedbackOverlay: document.getElementById("feedbackOverlay"),
  feedbackText: document.getElementById("feedbackText"),
  feedbackHint: document.getElementById("feedbackHint")
};

let currentQuestionId = null;
let pendingQuestionId = null;
let activeOverlayAction = null;
let overlayCompletesQuiz = false;
const shownQuestionDescriptions = new Set();

const quizQuestions = new Map((content.quiz?.questions ?? []).map((question) => [question.id, question]));

function questionTextFits(text, fontSize, element) {
  element.style.fontSize = `${fontSize}px`;
  element.textContent = text;
  return element.scrollHeight <= element.clientHeight;
}

function getBestQuestionFontSize(text, element) {
  for (let fontSize = QUESTION_TEXT_MAX_SIZE; fontSize >= QUESTION_TEXT_MIN_SIZE; fontSize -= 1) {
    if (questionTextFits(text, fontSize, element)) {
      return fontSize;
    }
  }

  return QUESTION_TEXT_MIN_SIZE;
}

function createAnswerButton(answer) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quiz-answer-button";
  button.setAttribute("aria-label", answer.label);

  const shape = document.createElement("img");
  shape.className = "quiz-answer-shape";
  shape.src = "assets/pulsante marrone.svg";
  shape.alt = "";
  shape.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.className = "quiz-answer-label";
  label.textContent = answer.label;

  button.append(shape, label);
  button.addEventListener("click", () => handleAnswerSelection(answer));
  return button;
}

function showQuizQuestionLayer() {
  ui.quizExperience.hidden = false;
  ui.quizCompletion.hidden = true;
}

function showQuizCompletionLayer() {
  ui.quizExperience.hidden = true;
  ui.quizCompletion.hidden = false;
}

function showOverlayCard(text, options = {}) {
  const { nextId = null, onClose = null, completesQuiz = false } = options;
  pendingQuestionId = nextId;
  activeOverlayAction = onClose;
  overlayCompletesQuiz = completesQuiz;
  ui.feedbackText.textContent = text;
  ui.feedbackOverlay.hidden = false;
  ui.feedbackOverlay.focus();
}

function finishQuiz() {
  const completion = content.quiz?.completion;
  if (!completion) {
    return;
  }

  showQuizCompletionLayer();
  ui.quizCompletionText.style.fontSize = `${getBestQuestionFontSize(completion.text, ui.quizCompletionText)}px`;
  ui.quizCompletionText.textContent = completion.text;
  currentQuestionId = null;
}

function maybeShowQuestionDescription(question) {
  if (!question?.description || shownQuestionDescriptions.has(question.id)) {
    return;
  }

  shownQuestionDescriptions.add(question.id);
  showOverlayCard(question.description);
}

function renderQuestion(questionId) {
  const question = quizQuestions.get(questionId);

  if (!question) {
    finishQuiz();
    return;
  }

  showQuizQuestionLayer();
  currentQuestionId = question.id;
  ui.quizQuestionText.style.fontSize = `${getBestQuestionFontSize(question.text, ui.quizQuestionText)}px`;
  ui.quizQuestionText.textContent = question.text;

  const answerButtons = question.answers.map((answer) => createAnswerButton(answer));
  ui.quizAnswers.replaceChildren(...answerButtons);
  maybeShowQuestionDescription(question);
}

function handleAnswerSelection(answer) {
  if (answer.feedback) {
    showOverlayCard(answer.feedback, {
      nextId: answer.nextId ?? null,
      completesQuiz: !answer.nextId
    });
    return;
  }

  if (answer.nextId) {
    renderQuestion(answer.nextId);
    return;
  }

  finishQuiz();
}

function closeFeedbackCard() {
  ui.feedbackOverlay.hidden = true;

  if (activeOverlayAction) {
    const action = activeOverlayAction;
    activeOverlayAction = null;
    action();
    return;
  }

  if (pendingQuestionId) {
    const nextId = pendingQuestionId;
    pendingQuestionId = null;
    overlayCompletesQuiz = false;
    renderQuestion(nextId);
    return;
  }

  pendingQuestionId = null;

  if (overlayCompletesQuiz) {
    overlayCompletesQuiz = false;
    finishQuiz();
  }
}

ui.feedbackOverlay.addEventListener("click", closeFeedbackCard);
ui.feedbackOverlay.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    closeFeedbackCard();
  }
});

window.addEventListener("resize", () => {
  if (currentQuestionId) {
    renderQuestion(currentQuestionId);
    return;
  }

  if (!ui.quizCompletion.hidden) {
    finishQuiz();
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  ui.feedbackHint.textContent = content.quiz?.tapToContinueLabel ?? "Tocca per continuare";

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (error) {
      console.error("Font non caricati correttamente:", error);
    }
  }

  renderQuestion(content.quiz?.startQuestionId);
});
