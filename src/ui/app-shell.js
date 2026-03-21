const createMissionScreen = (model, hidden = false) => {
  const { welcome } = model;

  return `
    <section class="mission-zero${hidden ? " is-hidden" : ""}" data-mission-zero ${
      hidden ? "hidden" : ""
    }>
      <div class="mission-zero__panel">
        <div class="quiz-stage" data-quiz-stage>
          <section class="mission-zero__welcome">
            <span class="section-heading__eyebrow">${welcome.eyebrow}</span>
            <h2 class="mission-zero__title">${welcome.title}</h2>
            <div class="story-card" data-story-card role="button" tabindex="0" aria-label="Carta introduttiva da girare">
              <div class="story-card__inner">
                <section class="story-card__face story-card__face--front" aria-label="Carta introduttiva fronte">
                  <div class="story-card__content">
                    <div class="mission-zero__copy">
                      ${welcome.card.front
                        .map((paragraph) => `<p class="quiz-step__text">${paragraph}</p>`)
                        .join("")}
                    </div>
                  </div>
                  <span class="story-card__arrow" aria-hidden="true">→</span>
                </section>
                <section class="story-card__face story-card__face--back" aria-label="Carta introduttiva retro">
                  <div class="story-card__content">
                    <div class="mission-zero__copy">
                      ${welcome.card.back
                        .map((paragraph) => `<p class="quiz-step__text">${paragraph}</p>`)
                        .join("")}
                    </div>
                  </div>
                  <span class="story-card__arrow story-card__arrow--back" aria-hidden="true">←</span>
                </section>
              </div>
            </div>
            <button class="quiz-cta" type="button" data-start-quiz>${welcome.cta}</button>
          </section>
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
      <div class="opening-screen__content opening-screen__content--title">
        <h1 class="opening-screen__title opening-screen__title--cover">${model.cover.title}</h1>
      </div>
    </section>

    <div class="app-frame">
      <main class="main-screen" aria-label="Schermata principale">
        ${createMissionScreen(model, !showMission)}
      </main>
    </div>
  `;

  return shell;
}
