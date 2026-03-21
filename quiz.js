const content = window.APP_CONTENT;
const quizContent = window.QUIZ_CONTENT ?? content.quiz ?? {};
const QUESTION_TEXT_MAX_SIZE = 31;
const QUESTION_TEXT_MIN_SIZE = 18;
const ANSWER_TEXT_MAX_SIZE = 20;
const ANSWER_TEXT_MIN_SIZE = 10;
const QUIZ_ANSWER_SHAPE = "etichetta-ghirigori.svg";
const QUIZ_ANSWER_FALLBACK_SHAPE = "assets/pulsante marrone.svg";

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

const quizQuestions = new Map((quizContent.questions ?? []).map((question) => [question.id, question]));

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getQuestionWidgetWidth(question) {
  const baseWidth = 392;
  const textBonus = (question.text?.length ?? 0) * 0.7;
  const answerBonus = Math.max(...(question.answers ?? []).map((answer) => answer.label.length), 0) * 0.4;
  return clampNumber(Math.round(baseWidth + textBonus + answerBonus), 392, 456);
}

function getQuestionTextHeight(question) {
  const textLength = question.text?.length ?? 0;
  return clampNumber(30 + Math.round(textLength / 24), 30, 40);
}

function getAnswerButtonWidth(label) {
  return clampNumber(Math.round(310 + label.length * 3.2), 320, 408);
}

function getAnswerButtonHeight(label) {
  return clampNumber(Math.round(74 + label.length * 0.9), 78, 112);
}

function questionTextFits(text, fontSize, element) {
  element.style.fontSize = `${fontSize}px`;
  element.textContent = text;
  return element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth;
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
  button.style.setProperty("--answer-button-width", `${getAnswerButtonWidth(answer.label)}px`);
  button.style.setProperty("--answer-button-height", `${getAnswerButtonHeight(answer.label)}px`);

  const shape = document.createElement("img");
  shape.className = "quiz-answer-shape";
  shape.src = QUIZ_ANSWER_SHAPE;
  shape.alt = "";
  shape.setAttribute("aria-hidden", "true");
  shape.addEventListener("error", () => {
    if (!shape.dataset.fallbackApplied) {
      shape.dataset.fallbackApplied = "true";
      shape.src = QUIZ_ANSWER_FALLBACK_SHAPE;
    }
  });

  const label = document.createElement("span");
  label.className = "quiz-answer-label";
  label.textContent = answer.label;
  label.style.fontSize = `${getBestAnswerFontSize(answer.label, label)}px`;

  button.append(shape, label);
  button.addEventListener("click", () => handleAnswerSelection(answer));
  return button;
}

function applyQuestionLayout(question) {
  ui.quizExperience.style.setProperty("--question-widget-width", `${getQuestionWidgetWidth(question)}px`);
  ui.quizExperience.style.setProperty("--question-text-height", `${getQuestionTextHeight(question)}%`);
}

function answerTextFits(text, fontSize, element) {
  element.style.fontSize = `${fontSize}px`;
  element.textContent = text;
  return element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth;
}

function getBestAnswerFontSize(text, element) {
  for (let fontSize = ANSWER_TEXT_MAX_SIZE; fontSize >= ANSWER_TEXT_MIN_SIZE; fontSize -= 1) {
    if (answerTextFits(text, fontSize, element)) {
      return fontSize;
    }
  }

  return ANSWER_TEXT_MIN_SIZE;
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
  const completion = quizContent.completion;
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
  applyQuestionLayout(question);
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
  ui.feedbackHint.textContent = quizContent.tapToContinueLabel ?? "Tocca per continuare";

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (error) {
      console.error("Font non caricati correttamente:", error);
    }
  }

  renderQuestion(quizContent.startQuestionId);
});
