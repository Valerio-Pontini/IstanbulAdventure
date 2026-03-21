const routes = {
  home: "#home",
  content: "#contenuto"
};

const ui = {
  onboardingPage: document.getElementById("onboardingPage"),
  storyPage: document.getElementById("storyPage"),
  enterAppButton: document.getElementById("enterAppButton"),
  actionButton: document.getElementById("svgActionButton"),
  widgetText: document.getElementById("widgetText")
};

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
  ui.widgetText.textContent = "Hai premuto il pulsante sotto alla textbox.";
});

window.addEventListener("DOMContentLoaded", syncPageWithRoute);
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
