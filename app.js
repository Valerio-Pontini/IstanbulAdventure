const routes = {
  home: "#home",
  content: "#contenuto"
};

const content = window.APP_CONTENT;
const STORY_TEXT_MAX_SIZE = 26;
const STORY_TEXT_MIN_SIZE = 16;

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
let storySlides = [];
let resizeTimeoutId = null;

function renderStaticContent() {
  ui.coverTitle.textContent = content.coverTitle;
  ui.coverHint.textContent = content.coverHint;
  ui.contentTitle.textContent = content.contentTitle;
  ui.actionButtonLabel.textContent = content.actionButtonLabel;
}

function textFits(text, fontSize) {
  ui.widgetText.style.fontSize = `${fontSize}px`;
  ui.widgetText.textContent = text;
  return ui.widgetText.scrollHeight <= ui.widgetText.clientHeight;
}

function getBestFittingFontSize(text) {
  for (let fontSize = STORY_TEXT_MAX_SIZE; fontSize >= STORY_TEXT_MIN_SIZE; fontSize -= 1) {
    if (textFits(text, fontSize)) {
      return fontSize;
    }
  }

  return null;
}

function paginateStoryText(text) {
  const words = text.trim().split(/\s+/);
  const pages = [];
  let currentWords = [];

  for (const word of words) {
    const candidateWords = [...currentWords, word];
    const candidateText = candidateWords.join(" ");

    if (getBestFittingFontSize(candidateText) !== null) {
      currentWords = candidateWords;
      continue;
    }

    if (currentWords.length === 0) {
      pages.push({
        text: candidateText,
        fontSize: STORY_TEXT_MIN_SIZE
      });
      continue;
    }

    const currentText = currentWords.join(" ");
    pages.push({
      text: currentText,
      fontSize: getBestFittingFontSize(currentText) ?? STORY_TEXT_MIN_SIZE
    });
    currentWords = [word];
  }

  if (currentWords.length > 0) {
    const currentText = currentWords.join(" ");
    pages.push({
      text: currentText,
      fontSize: getBestFittingFontSize(currentText) ?? STORY_TEXT_MIN_SIZE
    });
  }

  return pages;
}

function rebuildStorySlides() {
  storySlides = content.storySlides.flatMap((slide) => paginateStoryText(slide));
  currentSlideIndex = Math.min(currentSlideIndex, Math.max(storySlides.length - 1, 0));
}

function renderStorySlide() {
  const currentSlide = storySlides[currentSlideIndex];

  if (!currentSlide) {
    ui.widgetText.textContent = "";
    ui.prevTextButton.disabled = true;
    ui.nextTextButton.disabled = true;
    return;
  }

  ui.widgetText.style.fontSize = `${currentSlide.fontSize}px`;
  ui.widgetText.textContent = currentSlide.text;
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

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimeoutId);
  resizeTimeoutId = window.setTimeout(() => {
    rebuildStorySlides();
    renderStorySlide();
  }, 100);
});

window.addEventListener("DOMContentLoaded", async () => {
  renderStaticContent();
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (error) {
      console.error("Font non caricati correttamente:", error);
    }
  }
  rebuildStorySlides();
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
