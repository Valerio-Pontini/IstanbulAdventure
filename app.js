const routes = {
  home: "#home",
  content: "#contenuto"
};

const content = window.APP_CONTENT;
const storySlides = content.storySlides;

const ui = {
  onboardingPage: document.getElementById("onboardingPage"),
  storyPage: document.getElementById("storyPage"),
  enterAppButton: document.getElementById("enterAppButton"),
  actionButton: document.getElementById("svgActionButton"),
  coverTitle: document.getElementById("coverTitle"),
  coverHint: document.getElementById("coverHint"),
  contentTitle: document.getElementById("contentTitle"),
  actionButtonLabel: document.getElementById("actionButtonLabel"),
  widgetText: document.getElementById("widgetText"),
  prevTextButton: document.getElementById("prevTextButton"),
  nextTextButton: document.getElementById("nextTextButton")
};

let currentSlideIndex = 0;

function renderStaticContent() {
  ui.coverTitle.textContent = content.coverTitle;
  ui.coverHint.textContent = content.coverHint;
  ui.contentTitle.textContent = content.contentTitle;
  ui.actionButtonLabel.textContent = content.actionButtonLabel;
}

function renderStorySlide() {
  ui.widgetText.textContent = storySlides[currentSlideIndex];
  ui.prevTextButton.disabled = currentSlideIndex === 0;
  ui.nextTextButton.disabled = currentSlideIndex === storySlides.length - 1;
}

function setActivePage(targetPage, nextHash, statePage) {
  const isStoryPage = targetPage === ui.storyPage;

  ui.onboardingPage.classList.toggle("is-active", !isStoryPage);
  ui.storyPage.classList.toggle("is-active", isStoryPage);
  history.replaceState({ page: statePage }, "", nextHash);
}

function showStoryPage() {
  setActivePage(ui.storyPage, routes.content, "content");
}

function showOnboardingPage() {
  setActivePage(ui.onboardingPage, routes.home, "home");
}

function syncPageWithRoute() {
  if (window.location.hash === routes.content) {
    showStoryPage();
    return;
  }

  showOnboardingPage();
}

ui.enterAppButton.addEventListener("click", showStoryPage);

ui.actionButton.addEventListener("click", () => {
  currentSlideIndex = (currentSlideIndex + 1) % storySlides.length;
  renderStorySlide();
});

ui.prevTextButton.addEventListener("click", () => {
  if (currentSlideIndex === 0) {
    return;
  }

  currentSlideIndex -= 1;
  renderStorySlide();
});

ui.nextTextButton.addEventListener("click", () => {
  if (currentSlideIndex === storySlides.length - 1) {
    return;
  }

  currentSlideIndex += 1;
  renderStorySlide();
});

window.addEventListener("DOMContentLoaded", () => {
  renderStaticContent();
  renderStorySlide();
  syncPageWithRoute();
});
window.addEventListener("popstate", syncPageWithRoute);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (error) {
      console.error("Service worker non registrato:", error);
    }
  });
}
