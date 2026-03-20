const createLogo = () => `
  <div class="brand-lockup">
    <span class="brand-lockup__name">TravelGame</span>
    <span class="brand-lockup__tagline">Viaggia. Scopri. Gioca.</span>
  </div>
`;

const createMissionScreen = (model, hidden = false) => {
  const { missionZero, onboardingQuiz } = model;

  return `
    <section class="mission-zero${hidden ? " is-hidden" : ""}" data-mission-zero ${
      hidden ? "hidden" : ""
    }>
      <div class="mission-zero__panel">
        <div class="section-heading">
          <span class="section-heading__eyebrow">${missionZero.eyebrow}</span>
          <h1 class="mission-zero__title">${missionZero.title}</h1>
          <p class="mission-zero__description">${missionZero.description}</p>
        </div>

        <div class="quiz-card" data-quiz-card>
          <div class="quiz-card__progress" aria-hidden="true">
            <span class="quiz-card__progress-bar" data-quiz-progress-bar></span>
          </div>

          <div class="quiz-stage" data-quiz-stage>
            <section class="quiz-step" data-quiz-intro>
              <span class="section-heading__eyebrow">${onboardingQuiz.intro.eyebrow}</span>
              <h2 class="mission-zero__title">${onboardingQuiz.intro.title}</h2>
              <p class="quiz-step__text">${onboardingQuiz.intro.description}</p>
              <button class="quiz-cta" type="button" data-start-quiz>${missionZero.cta}</button>
            </section>
          </div>
        </div>
      </div>
    </section>
  `;
};

export function createAppShell(model, options = {}) {
  const { showOpening = false, showMission = false } = options;
  const shell = document.createElement("div");
  shell.className = `app-shell${showOpening ? " is-opening-active" : ""}`;

  shell.innerHTML = `
    <section
      class="opening-screen"
      data-opening-screen
      aria-label="Schermata di apertura"
      ${showOpening ? "" : "hidden"}
    >
      <div class="opening-screen__media" aria-hidden="true">
        <img
          class="opening-screen__image"
          src="./src/assets/hero-onboarding.png"
          alt=""
        />
      </div>
      <div class="opening-screen__content">
        ${createLogo()}
      </div>
      <div class="opening-screen__hint" aria-hidden="true">
        <span class="opening-screen__hint-line"></span>
        <span class="opening-screen__hint-text">Tocca per iniziare</span>
      </div>
    </section>

    <div class="app-frame">
      <main class="main-screen" aria-label="Schermata principale">
        <div class="main-screen__background" aria-hidden="true"></div>
        ${createMissionScreen(model, !showMission)}
      </main>
    </div>
  `;

  return shell;
}
