import {
  createAppShell,
  createQuizIntro,
  createQuizQuestion,
  createQuizResult,
} from "./ui/app-shell.js";
import { homeViewModel } from "./state/home-view-model.js";

const HOME_VISITED_KEY = "travelgame-home-visited";
const ONBOARDING_RESULT_KEY = "travelgame-onboarding-result";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("Root container #app non trovato.");
}

const hasVisitedHome = window.localStorage.getItem(HOME_VISITED_KEY) === "true";
const appShell = createAppShell(homeViewModel, { showOpening: !hasVisitedHome });
root.append(appShell);

const openingScreen = appShell.querySelector("[data-opening-screen]");
const quizRoot = appShell.querySelector("[data-onboarding-quiz]");
const quizStage = appShell.querySelector("[data-quiz-stage]");
const quizProgress = appShell.querySelector("[data-quiz-progress]");
const storedQuizResult = window.localStorage.getItem(ONBOARDING_RESULT_KEY);
const shouldShowQuiz = !storedQuizResult;

if (quizRoot && quizStage && shouldShowQuiz) {
  const quizData = homeViewModel.onboardingQuiz;
  const totalQuestions = quizData.questions.length;
  const answers = [];
  let currentStep = -1;
  let currentDirection = "forward";

  quizRoot.hidden = false;

  const setQuizProgress = (progressValue) => {
    if (!quizProgress) {
      return;
    }

    quizProgress.style.setProperty("--quiz-progress", `${progressValue}`);
  };

  const renderStage = (markup) => {
    quizStage.classList.remove("is-animating", "is-forward", "is-backward");
    void quizStage.offsetWidth;
    quizStage.innerHTML = markup;
    quizStage.classList.add("is-animating", currentDirection === "backward" ? "is-backward" : "is-forward");
  };

  const showQuizPanel = () => {
    if (currentStep === -1) {
      renderStage(createQuizIntro(quizData.intro));
    } else {
      renderStage(createQuizQuestion(quizData.questions[currentStep], currentStep));
    }
    setQuizProgress(Math.max(currentStep, 0) / totalQuestions);
  };

  const showQuizResult = (profile) => {
    renderStage(createQuizResult(quizData.results[profile]));
    setQuizProgress(1);
    window.localStorage.setItem(ONBOARDING_RESULT_KEY, profile);
  };

  const resolveResultProfile = () => {
    const scores = answers.reduce((accumulator, answerProfile) => {
      accumulator[answerProfile] = (accumulator[answerProfile] || 0) + 1;
      return accumulator;
    }, {});

    return (
      Object.keys(quizData.results).sort((left, right) => {
        const leftScore = scores[left] || 0;
        const rightScore = scores[right] || 0;
        return rightScore - leftScore;
      })[0] || "explorer"
    );
  };

  showQuizPanel();

  quizRoot.addEventListener("click", (event) => {
    const startButton = event.target.closest("[data-quiz-start]");
    const answerButton = event.target.closest("[data-quiz-answer]");

    if (startButton) {
      currentDirection = "forward";
      currentStep = 0;
      showQuizPanel();
      return;
    }

    if (!answerButton || currentStep < 0) {
      return;
    }

    const question = quizData.questions[currentStep];
    const answerIndex = Number.parseInt(answerButton.dataset.answerIndex || "", 10);
    const selectedAnswer = question?.answers[answerIndex];

    if (!selectedAnswer) {
      return;
    }

    answers[currentStep] = selectedAnswer.profile;

    if (currentStep === totalQuestions - 1) {
      currentDirection = "forward";
      showQuizResult(resolveResultProfile());
      return;
    }

    currentDirection = "forward";
    currentStep += 1;
    showQuizPanel();
  });
}

if (openingScreen && !hasVisitedHome) {
  document.body.classList.add("is-opening-active");

  openingScreen.addEventListener("click", () => {
    appShell.classList.remove("is-opening-active");
    openingScreen.hidden = true;
    document.body.classList.remove("is-opening-active");
    window.localStorage.setItem(HOME_VISITED_KEY, "true");
  });
}
