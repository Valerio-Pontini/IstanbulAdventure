const content = window.APP_CONTENT;
const quizContent = window.QUIZ_CONTENT ?? content.quiz ?? {};
const QUESTION_TEXT_MIN_SIZE = 14;
const ANSWER_TEXT_MIN_SIZE = 8;
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
let pendingQuestionFrame = null;

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

function getAnswerFontBounds(element) {
  const button = element.closest(".quiz-answer-button");
  const buttonWidth = button?.clientWidth ?? element.clientWidth;
  const textHeight = element.clientHeight;
  const derivedMax = Math.round(Math.min(buttonWidth * 0.044, textHeight * 0.56));
  const derivedMin = Math.round(Math.min(buttonWidth * 0.026, textHeight * 0.34));

  return {
    max: clampNumber(derivedMax, 12, 18),
    min: clampNumber(derivedMin, ANSWER_TEXT_MIN_SIZE, 11)
  };
}

function questionTextFits(text, fontSize, element) {
  element.style.fontSize = `${fontSize}px`;
  element.textContent = text;
  return element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth;
}

function getQuestionFontBounds(element) {
  const widget = element.closest(".quiz-widget");
  const widgetWidth = widget?.clientWidth ?? element.clientWidth;
  const textHeight = element.clientHeight;
  const derivedMax = Math.round(Math.min(widgetWidth * 0.046, textHeight * 0.42));
  const derivedMin = Math.round(Math.min(widgetWidth * 0.024, textHeight * 0.26));

  return {
    max: clampNumber(derivedMax, 15, 23),
    min: clampNumber(derivedMin, 11, 15)
  };
}

function getBestQuestionFontSize(text, element) {
  const { max, min } = getQuestionFontBounds(element);

  for (let fontSize = max; fontSize >= min; fontSize -= 1) {
    if (questionTextFits(text, fontSize, element)) {
      return fontSize;
    }
  }

  return min;
}

function fitTextToQuestionFrame(element, text) {
  element.textContent = text;
  element.style.fontSize = "";

  if (pendingQuestionFrame) {
    window.cancelAnimationFrame(pendingQuestionFrame);
  }

  pendingQuestionFrame = window.requestAnimationFrame(() => {
    element.style.fontSize = `${getBestQuestionFontSize(text, element)}px`;
    pendingQuestionFrame = null;
  });
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
  const { max, min } = getAnswerFontBounds(element);

  for (let fontSize = max; fontSize >= min; fontSize -= 1) {
    if (answerTextFits(text, fontSize, element)) {
      return fontSize;
    }
  }

  return min;
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
  fitTextToQuestionFrame(ui.quizCompletionText, completion.text);
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
  fitTextToQuestionFrame(ui.quizQuestionText, question.text);

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
  if (pendingQuestionFrame) {
    window.cancelAnimationFrame(pendingQuestionFrame);
    pendingQuestionFrame = null;
  }

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
