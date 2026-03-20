const createLogo = () => `
  <div class="brand-lockup">
    <span class="brand-lockup__name">TravelGame</span>
    <span class="brand-lockup__tagline">Viaggia. Scopri. Gioca.</span>
  </div>
`;

export function createAppShell(model, options = {}) {
  const { showOpening = false } = options;
  const shell = document.createElement("div");
  shell.className = `app-shell${showOpening ? " is-opening-active" : ""}`;

  shell.innerHTML = `
    <button
      class="opening-screen"
      type="button"
      data-opening-screen
      aria-label="Apri la schermata principale"
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
        <p class="opening-screen__text">${model.brand.intro}</p>
      </div>
      <div class="opening-screen__hint" aria-hidden="true">
        <span class="opening-screen__hint-line"></span>
        <span class="opening-screen__hint-text">Tocca per entrare</span>
      </div>
    </button>

    <div class="app-frame">
      <main class="main-screen" aria-label="Schermata principale">
        <div class="main-screen__background" aria-hidden="true"></div>
      </main>
    </div>
  `;

  return shell;
}
