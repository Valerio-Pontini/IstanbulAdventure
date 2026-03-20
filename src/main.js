import { createAppShell } from "./ui/app-shell.js";
import { homeViewModel } from "./state/home-view-model.js";

const MISSION_ZERO_COMPLETED_KEY = "travelgame-mission-zero-completed";
const PLAYER_TRIBE_KEY = "travelgame-player-tribe";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("Root container #app non trovato.");
}

const hasCompletedMissionZero =
  window.localStorage.getItem(MISSION_ZERO_COMPLETED_KEY) === "true";
const appShell = createAppShell(homeViewModel, {
  showOpening: !hasCompletedMissionZero,
  showMission: !hasCompletedMissionZero,
});
root.append(appShell);

const openingScreen = appShell.querySelector("[data-opening-screen]");
const missionZeroScreen = appShell.querySelector("[data-mission-zero]");
const quizStage = appShell.querySelector("[data-quiz-stage]");
const startQuizButton = appShell.querySelector("[data-start-quiz]");
const progressBar = appShell.querySelector("[data-quiz-progress-bar]");

const { onboardingQuiz } = homeViewModel;

let currentQuestionIndex = 0;
const answers = [];
let currentProfile = null;

const updateProgress = (value) => {
  if (!progressBar) {
    return;
  }

  progressBar.style.width = `${value * 100}%`;
};

const hideOpening = () => {
  if (!openingScreen) {
    return;
  }

  appShell.classList.remove("is-opening-active");
  openingScreen.hidden = true;
  document.body.classList.remove("is-opening-active");
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

const resolveProfile = (entries) => {
  const scores = entries.reduce((accumulator, profile) => {
    accumulator[profile] = (accumulator[profile] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(scores).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "explorer";
};

const renderQuestion = (index) => {
  if (!quizStage) {
    return;
  }

  const question = onboardingQuiz.questions[index];

  updateProgress((index + 1) / onboardingQuiz.questions.length);

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
                ${answer.label}
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

  const result = onboardingQuiz.results[profile];
  updateProgress(1);

  quizStage.innerHTML = `
    <section class="quiz-step quiz-step--result">
      <span class="section-heading__eyebrow">${result.eyebrow}</span>
      <h2 class="mission-zero__title">${result.title}</h2>
      <p class="quiz-step__text">${result.description}</p>
      <button class="quiz-cta" type="button" data-complete-mission>
        ${homeViewModel.missionZero.completeCta}
      </button>
    </section>
  `;
};

if (openingScreen && !hasCompletedMissionZero) {
  document.body.classList.add("is-opening-active");
} else {
  hideMission();
}

if (openingScreen && !hasCompletedMissionZero) {
  openingScreen.addEventListener("click", () => {
    hideOpening();
    showMission();
    updateProgress(0);
  });
}

if (startQuizButton && !hasCompletedMissionZero) {
  startQuizButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    answers.length = 0;
    renderQuestion(currentQuestionIndex);
  });
}

if (quizStage && !hasCompletedMissionZero) {
  quizStage.addEventListener("click", (event) => {
    const answerButton = event.target.closest("[data-answer-profile]");
    const finishButton = event.target.closest("[data-complete-mission]");

    if (answerButton) {
      answers.push(answerButton.dataset.answerProfile);
      currentQuestionIndex += 1;

      if (currentQuestionIndex < onboardingQuiz.questions.length) {
        renderQuestion(currentQuestionIndex);
        return;
      }

      currentProfile = resolveProfile(answers);
      window.localStorage.setItem(PLAYER_TRIBE_KEY, currentProfile);
      renderResult(currentProfile);
      return;
    }

    if (finishButton) {
      window.localStorage.setItem(MISSION_ZERO_COMPLETED_KEY, "true");
      hideMission();
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Registrazione service worker fallita:", error);
    });
  });
}
