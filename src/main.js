import { createAppShell } from "./ui/app-shell.js";
import { homeViewModel } from "./state/home-view-model.js";

const HOME_VISITED_KEY = "travelgame-home-visited";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("Root container #app non trovato.");
}

const hasVisitedHome = window.localStorage.getItem(HOME_VISITED_KEY) === "true";
const appShell = createAppShell(homeViewModel, { showOpening: !hasVisitedHome });
root.append(appShell);

const openingScreen = appShell.querySelector("[data-opening-screen]");

if (openingScreen && !hasVisitedHome) {
  document.body.classList.add("is-opening-active");

  openingScreen.addEventListener("click", () => {
    appShell.classList.remove("is-opening-active");
    openingScreen.hidden = true;
    document.body.classList.remove("is-opening-active");
    window.localStorage.setItem(HOME_VISITED_KEY, "true");
  });
}
