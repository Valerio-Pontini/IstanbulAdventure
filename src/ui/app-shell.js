const createLogo = () => `
  <div class="brand-lockup">
    <span class="brand-lockup__name">TravelGame</span>
    <span class="brand-lockup__tagline">Viaggia. Scopri. Gioca.</span>
  </div>
`;

const createStat = ({ value, label }) => `
  <article class="stat-card">
    <span class="stat-card__value">${value}</span>
    <span class="stat-card__label">${label}</span>
  </article>
`;

const createSection = ({ eyebrow, title, description }) => `
  <article class="feature-card">
    <span class="feature-card__eyebrow">${eyebrow}</span>
    <h3 class="feature-card__title">${title}</h3>
    <p class="feature-card__description">${description}</p>
  </article>
`;

const createNavigationItem = ({ label, icon, current }) => `
  <button
    class="bottom-nav__item${current ? " is-current" : ""}"
    type="button"
    aria-current="${current ? "page" : "false"}"
  >
    <span class="bottom-nav__icon" aria-hidden="true">${icon}</span>
    <span class="bottom-nav__label">${label}</span>
  </button>
`;

const createInfoCard = ({ title, description }) => `
  <article class="info-card">
    <h3 class="info-card__title">${title}</h3>
    <p class="info-card__description">${description}</p>
  </article>
`;

export const createQuizAnswer = (answer, index) => `
  <button
    class="quiz-answer"
    type="button"
    data-quiz-answer
    data-answer-index="${index}"
  >
    ${answer.label}
  </button>
`;

export const createQuizQuestion = (question, questionIndex) => `
  <section class="quiz-step">
    <div class="section-heading">
      <p class="section-heading__eyebrow">Domanda ${questionIndex + 1}</p>
      <h3 class="section-heading__title">${question.question}</h3>
    </div>
    <div class="quiz-answers">
      ${question.answers.map(createQuizAnswer).join("")}
    </div>
  </section>
`;

export const createQuizIntro = (intro) => `
  <section class="quiz-step">
    <div class="section-heading">
      <p class="section-heading__eyebrow">${intro.eyebrow}</p>
      <h2 class="section-heading__title">${intro.title}</h2>
    </div>
    <p class="quiz-step__text">${intro.description}</p>
    <button class="quiz-cta" type="button" data-quiz-start>
      ${intro.cta}
    </button>
  </section>
`;

export const createQuizResult = (result) => `
  <section class="quiz-step">
    <div class="section-heading">
      <p class="section-heading__eyebrow">${result.eyebrow}</p>
      <h3 class="section-heading__title">${result.title}</h3>
    </div>
    <p class="quiz-step__text">${result.description}</p>
  </section>
`;

export function createAppShell(model) {
  const shell = document.createElement("div");
  shell.className = "app-shell";

  shell.innerHTML = `
    <div class="app-frame">
      <div class="app-frame__glow app-frame__glow--top"></div>
      <div class="app-frame__glow app-frame__glow--bottom"></div>

      <main class="content">
        <section class="home-intro" data-home-intro>
          <div class="home-intro__media" aria-hidden="true">
            <img
              class="home-intro__image"
              src="./src/assets/hero-onboarding.png"
              alt=""
            />
          </div>
          <div class="home-intro__content">
            ${createLogo()}
            <p class="home-intro__text">${model.brand.intro}</p>
          </div>
          <div class="home-intro__hint" aria-hidden="true">
            <span class="home-intro__hint-line"></span>
            <span class="home-intro__hint-text">Scorri per entrare</span>
          </div>
        </section>

        <section class="hero panel" data-content-start>
          <div class="quiz-card" data-onboarding-quiz hidden>
            <div class="quiz-card__progress" data-quiz-progress>
              <span class="quiz-card__progress-bar"></span>
            </div>
            <div class="quiz-stage" data-quiz-stage></div>
          </div>

          <div class="section-heading">
            <p class="section-heading__eyebrow">Concept</p>
            <h2 class="section-heading__title">Una home che si apre e poi lascia spazio</h2>
          </div>
          <p class="hero__subtitle">${model.brand.intro}</p>
          <div class="hero__stats">
            ${model.highlights.map(createStat).join("")}
          </div>
        </section>

        <section class="panel panel--highlight">
          <div class="section-heading">
            <p class="section-heading__eyebrow">Dynamic Area</p>
            <h2 class="section-heading__title">Contenuti informativi e dinamici</h2>
          </div>
          <div class="info-grid">
            ${model.infoCards.map(createInfoCard).join("")}
          </div>
        </section>

        <section class="panel">
          <div class="section-heading">
            <p class="section-heading__eyebrow">Core</p>
            <h2 class="section-heading__title">Blocchi di contenuto</h2>
          </div>
          <div class="feature-list">
            ${model.infoSections.map(createSection).join("")}
          </div>
        </section>
      </main>

      <nav class="bottom-nav" aria-label="Navigazione principale">
        ${model.navigation.map(createNavigationItem).join("")}
      </nav>
    </div>
  `;

  return shell;
}
