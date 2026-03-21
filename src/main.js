import { createAppShell } from "./ui/app-shell.js";
import { gameText } from "./content/game-text.js";
import { loadUiSvgAssets } from "./ui/svg-assets.js";

const MISSION_ZERO_COMPLETED_KEY = "travelgame-mission-zero-completed";
const PLAYER_TRIBE_KEY = "travelgame-player-tribe";
const ENABLE_SW = false; // metti true solo quando vuoi davvero testare la PWA/cache

const root = document.querySelector("#app");

if (!root) {
  throw new Error("Root container #app non trovato.");
}

const createSvgButtonMarkup = ({
  frameMarkup,
  className,
  labelClassName,
  label,
  dataAttribute = "",
}) => `
  <button class="${className}" type="button" ${dataAttribute}>
    ${frameMarkup}
    <span class="${labelClassName}">${label}</span>
  </button>
`;

const storage = {
  hasCompletedMissionZero() {
    return window.localStorage.getItem(MISSION_ZERO_COMPLETED_KEY) === "true";
  },
  setCompletedMissionZero(value) {
    window.localStorage.setItem(MISSION_ZERO_COMPLETED_KEY, String(value));
  },
  setPlayerTribe(profile) {
    window.localStorage.setItem(PLAYER_TRIBE_KEY, profile);
  },
};

const state = {
  currentQuestionIndex: 0,
  answers: [],
  currentProfile: null,
};

const { missionZero } = gameText;

let appShell = null;
let openingScreen = null;
let missionZeroScreen = null;
let quizStage = null;
let uiSvgAssets = null;

const getStoryCard = () => quizStage?.querySelector("[data-story-card]") ?? null;

const syncBodyOpeningState = (isActive) => {
  document.body.classList.toggle("is-opening-active", isActive);
  appShell?.classList.toggle("is-opening-active", isActive);
};

const hideOpening = () => {
  if (!openingScreen) {
    return;
  }

  openingScreen.hidden = true;
  syncBodyOpeningState(false);
};

const showMission = () => {
  if (!missionZeroScreen) {
    return;
  }

  missionZeroScreen.hidden = false;
  missionZeroScreen.classList.remove("is-hidden");
};

const hideMission = () => {
  if (!missionZeroScreen) {
    return;
  }

  missionZeroScreen.hidden = true;
  missionZeroScreen.classList.add("is-hidden");
};

const resetQuizState = () => {
  state.currentQuestionIndex = 0;
  state.answers = [];
  state.currentProfile = null;
};

const resolveProfile = (entries) => {
  const scores = entries.reduce((accumulator, profile) => {
    accumulator[profile] = (accumulator[profile] || 0) + 1;
    return accumulator;
  }, {});

  return (
    Object.entries(scores).sort((left, right) => right[1] - left[1])[0]?.[0] ??
    "explorer"
  );
};

const renderQuestion = (index) => {
  if (!quizStage) {
    return;
  }

  const question = missionZero.questions[index];

  if (!question) {
    return;
  }

  quizStage.innerHTML = `
    <section class="quiz-step">
      <span class="section-heading__eyebrow">Domanda ${index + 1}</span>
      <h2 class="mission-zero__title">${question.question}</h2>
      <div class="quiz-answers">
        ${question.answers
          .map(
            (answer) => `
              <button
                class="quiz-answer"
                type="button"
                data-answer-profile="${answer.profile}"
              >
                ${uiSvgAssets.answerFrame}
                <span class="quiz-answer__label">${answer.label}</span>
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderResult = (profile) => {
  if (!quizStage) {
    return;
  }

  const result = missionZero.results[profile];

  if (!result) {
    return;
  }

  quizStage.innerHTML = `
    <section class="quiz-step quiz-step--result">
      <span class="section-heading__eyebrow">${result.eyebrow}</span>
      <h2 class="mission-zero__title">${result.title}</h2>
      <p class="quiz-step__text">${result.description}</p>
      ${createSvgButtonMarkup({
        frameMarkup: uiSvgAssets.ctaFrame,
        className: "quiz-cta",
        labelClassName: "quiz-cta__label",
        label: missionZero.completeCta,
        dataAttribute: "data-complete-mission",
      })}
    </section>
  `;
};

const toggleStoryCard = () => {
  const storyCard = getStoryCard();

  if (!storyCard) {
    return;
  }

  const isFlipped = storyCard.classList.toggle("is-flipped");
  storyCard.setAttribute("aria-pressed", String(isFlipped));
};

const startQuiz = () => {
  resetQuizState();
  renderQuestion(state.currentQuestionIndex);
};

const handleAnswer = (profile) => {
  state.answers.push(profile);
  state.currentQuestionIndex += 1;

  if (state.currentQuestionIndex < missionZero.questions.length) {
    renderQuestion(state.currentQuestionIndex);
    return;
  }

  state.currentProfile = resolveProfile(state.answers);
  storage.setPlayerTribe(state.currentProfile);
  renderResult(state.currentProfile);
};

const completeMission = () => {
  storage.setCompletedMissionZero(true);
  hideMission();
};

const bindOpeningEvents = () => {
  if (!openingScreen || storage.hasCompletedMissionZero()) {
    hideOpening();
    return;
  }

  syncBodyOpeningState(true);

  openingScreen.addEventListener("click", () => {
    hideOpening();
    showMission();
  });
};

const bindQuizEvents = () => {
  if (!quizStage || storage.hasCompletedMissionZero()) {
    return;
  }

  quizStage.addEventListener("click", (event) => {
    const startButton = event.target.closest("[data-start-quiz]");
    const answerButton = event.target.closest("[data-answer-profile]");
    const finishButton = event.target.closest("[data-complete-mission]");
    const storyCard = event.target.closest("[data-story-card]");

    if (startButton) {
      startQuiz();
      return;
    }

    if (answerButton) {
      handleAnswer(answerButton.dataset.answerProfile);
      return;
    }

    if (finishButton) {
      completeMission();
      return;
    }

    if (storyCard) {
      toggleStoryCard();
    }
  });

  quizStage.addEventListener("keydown", (event) => {
    const storyCard = event.target.closest("[data-story-card]");

    if (!storyCard) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleStoryCard();
  });
};

const init = async () => {
  uiSvgAssets = await loadUiSvgAssets();

  const hasCompletedMissionZero = storage.hasCompletedMissionZero();

  appShell = createAppShell(gameText, uiSvgAssets, {
    showOpening: !hasCompletedMissionZero,
    showMission: !hasCompletedMissionZero,
  });

  root.replaceChildren(appShell);

  openingScreen = appShell.querySelector("[data-opening-screen]");
  missionZeroScreen = appShell.querySelector("[data-mission-zero]");
  quizStage = appShell.querySelector("[data-quiz-stage]");

  if (hasCompletedMissionZero) {
    hideMission();
    hideOpening();
  } else {
    showMission();
  }

  bindOpeningEvents();
  bindQuizEvents();
};

init().catch((error) => {
  console.error("Inizializzazione interfaccia fallita:", error);
});

if (ENABLE_SW && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Registrazione service worker fallita:", error);
    });
  });
}