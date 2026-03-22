const APP_CONTENT = window.APP_CONTENT ?? {};
const QUIZ_CONTENT = window.QUIZ_CONTENT ?? {};
const MISSION_ZERO_RESULT_CONTENT = window.MISSION_ZERO_RESULT_CONTENT ?? {};
const MISSION_HOME_CONTENT = window.MISSION_HOME_CONTENT ?? {};

const STORY_SLIDES = APP_CONTENT.storySlides ?? [];
const quizQuestions = new Map((QUIZ_CONTENT.questions ?? []).map((question) => [question.id, question]));
const primaryQuestionIds = (QUIZ_CONTENT.questions ?? [])
  .filter((question) => question.id.startsWith("p"))
  .map((question) => question.id);

const STORAGE_KEYS = {
  homeUnlocked: "istanbulAdventure.homeUnlocked",
  categoryId: "istanbulAdventure.categoryId"
};

const ui = {
  scenes: {
    entry: document.getElementById("scene-entry"),
    story: document.getElementById("scene-story"),
    mission: document.getElementById("scene-mission"),
    complete: document.getElementById("scene-complete"),
    home: document.getElementById("scene-home"),
    categoryDetail: document.getElementById("scene-category-detail")
  },
  statusPill: document.getElementById("statusPill"),
  enterButton: document.getElementById("enterButton"),
  jumpToMissionButton: document.getElementById("jumpToMissionButton"),
  storyText: document.getElementById("storyText"),
  storyIndex: document.getElementById("storyIndex"),
  storyProgress: document.getElementById("storyProgress"),
  storyPrev: document.getElementById("storyPrev"),
  storyNext: document.getElementById("storyNext"),
  missionTitle: document.getElementById("missionTitle"),
  missionIntro: document.getElementById("missionIntro"),
  questionCounter: document.getElementById("questionCounter"),
  questionMeta: document.getElementById("questionMeta"),
  tapHint: document.getElementById("tapHint"),
  questionProgress: document.getElementById("questionProgress"),
  questionText: document.getElementById("questionText"),
  answerGrid: document.getElementById("answerGrid"),
  completionKicker: document.getElementById("completionKicker"),
  completionTitleText: document.getElementById("completionTitleText"),
  completionText: document.getElementById("completionText"),
  completionNote: document.getElementById("completionNote"),
  completionHomeButton: document.getElementById("completionHomeButton"),
  restartButton: document.getElementById("restartButton"),
  completionVisual: document.getElementById("completionVisual"),
  completionProfileCard: document.getElementById("completionProfileCard"),
  completionProfileBadge: document.getElementById("completionProfileBadge"),
  completionProfileTitle: document.getElementById("completionProfileTitle"),
  completionProfileDescription: document.getElementById("completionProfileDescription"),
  homeTitle: document.getElementById("homeTitle"),
  homeText: document.getElementById("homeText"),
  homeProfileChip: document.getElementById("homeProfileChip"),
  homeProfileBadge: document.getElementById("homeProfileBadge"),
  homeProfileChipTitle: document.getElementById("homeProfileChipTitle"),
  homeProfileTitle: document.getElementById("homeProfileTitle"),
  homeProfileText: document.getElementById("homeProfileText"),
  homeOverviewText: document.getElementById("homeOverviewText"),
  homeNavGeneralLabel: document.getElementById("homeNavGeneralLabel"),
  homeNavGeneralCount: document.getElementById("homeNavGeneralCount"),
  homeNavLocationsLabel: document.getElementById("homeNavLocationsLabel"),
  homeNavLocationsCount: document.getElementById("homeNavLocationsCount"),
  homeNavPersonalLabel: document.getElementById("homeNavPersonalLabel"),
  homeNavPersonalCount: document.getElementById("homeNavPersonalCount"),
  totalMissionLabel: document.getElementById("totalMissionLabel"),
  totalMissionCount: document.getElementById("totalMissionCount"),
  generalMissionLabel: document.getElementById("generalMissionLabel"),
  generalMissionCount: document.getElementById("generalMissionCount"),
  locationMissionLabel: document.getElementById("locationMissionLabel"),
  locationMissionCount: document.getElementById("locationMissionCount"),
  personalMissionLabel: document.getElementById("personalMissionLabel"),
  personalMissionCount: document.getElementById("personalMissionCount"),
  generalPanelTitle: document.getElementById("generalPanelTitle"),
  generalPanelText: document.getElementById("generalPanelText"),
  generalSectionCount: document.getElementById("generalSectionCount"),
  generalOpenButton: document.getElementById("generalOpenButton"),
  generalMissionList: document.getElementById("generalMissionList"),
  locationPanelTitle: document.getElementById("locationPanelTitle"),
  locationPanelText: document.getElementById("locationPanelText"),
  locationSectionCount: document.getElementById("locationSectionCount"),
  locationOpenButton: document.getElementById("locationOpenButton"),
  locationMissionList: document.getElementById("locationMissionList"),
  personalPanelTitle: document.getElementById("personalPanelTitle"),
  personalPanelText: document.getElementById("personalPanelText"),
  personalSectionCount: document.getElementById("personalSectionCount"),
  personalOpenButton: document.getElementById("personalOpenButton"),
  personalMissionList: document.getElementById("personalMissionList"),
  archiveButtons: Array.from(document.querySelectorAll("[data-section]")),
  detailBackButton: document.getElementById("detailBackButton"),
  detailCategoryCount: document.getElementById("detailCategoryCount"),
  detailTitle: document.getElementById("detailTitle"),
  detailText: document.getElementById("detailText"),
  detailFilterTitle: document.getElementById("detailFilterTitle"),
  detailFilterRow: document.getElementById("detailFilterRow"),
  detailResultsCount: document.getElementById("detailResultsCount"),
  detailMissionList: document.getElementById("detailMissionList"),
  detailEmptyState: document.getElementById("detailEmptyState"),
  detailEmptyTitle: document.getElementById("detailEmptyTitle"),
  detailEmptyText: document.getElementById("detailEmptyText"),
  feedbackOverlay: document.getElementById("feedbackOverlay"),
  feedbackText: document.getElementById("feedbackText"),
  feedbackHint: document.getElementById("feedbackHint"),
  overlayDismiss: document.getElementById("overlayDismiss")
};

let currentScene = "entry";
let storyIndex = 0;
let currentQuestionId = null;
let currentPrimaryIndex = 0;
let completedPrimaryCount = 0;
let pendingNextId = null;
let pendingCompletesQuiz = false;
let resolvedCategoryId = null;
let activeDetailSection = "general";
let activeDetailFilter = "all";
let categoryScores = {};
let categoryTrail = [];
let activeAnswerButton = null;
const lastAnswerOrders = new Map();

function setScene(sceneName) {
  currentScene = sceneName;
  document.body.dataset.scene = sceneName;

  Object.entries(ui.scenes).forEach(([name, element]) => {
    const isActive = name === sceneName;
    element.classList.toggle("is-active", isActive);
    element.hidden = !isActive;
  });

  const labels = {
    entry: "Ingresso",
    story: "Prologo",
    mission: "Missione 0",
    complete: "Esito",
    home: MISSION_HOME_CONTENT.statusLabel || "Home missioni",
    categoryDetail: "Archivio missioni"
  };

  ui.statusPill.textContent = labels[sceneName] || "Istanbul Adventure";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setProgress(element, value) {
  element.style.width = `${Math.max(0, Math.min(100, value))}%`;
}

function formatCount(value) {
  return String(value).padStart(2, "0");
}

function createIconMarkup(iconSrc, iconAlt, fallbackText) {
  if (iconSrc) {
    return `<img src="${iconSrc}" alt="${iconAlt || ""}">`;
  }
  return `<span>${fallbackText || "?"}</span>`;
}

function isHomeUnlocked() {
  return window.localStorage.getItem(STORAGE_KEYS.homeUnlocked) === "true";
}

function getStoredCategoryId() {
  return window.localStorage.getItem(STORAGE_KEYS.categoryId) || null;
}

function persistHomeProfile(categoryId) {
  window.localStorage.setItem(STORAGE_KEYS.homeUnlocked, "true");
  window.localStorage.setItem(STORAGE_KEYS.categoryId, categoryId || "");
}

function getCategoryIdFromAnswer(answer) {
  if (answer.categoryId) {
    return answer.categoryId;
  }

  const nextIdPrefix = answer.nextId?.split("_")[0];
  if (nextIdPrefix && MISSION_HOME_CONTENT.categories?.[nextIdPrefix]) {
    return nextIdPrefix;
  }

  return null;
}

function trackCategoryAnswer(questionId, answer) {
  if (!questionId.startsWith("p")) {
    return;
  }

  const categoryId = getCategoryIdFromAnswer(answer);
  if (!categoryId) {
    return;
  }

  categoryScores[categoryId] = (categoryScores[categoryId] || 0) + 1;
  categoryTrail.push(categoryId);
}

function resolveCategoryId() {
  const categoryIds = Object.keys(MISSION_HOME_CONTENT.categories || {});
  const scoredEntries = Object.entries(categoryScores).filter(([categoryId]) => categoryIds.includes(categoryId));

  if (scoredEntries.length === 0) {
    return getStoredCategoryId() || categoryIds[0] || null;
  }

  const topScore = Math.max(...scoredEntries.map(([, score]) => score));
  const tiedIds = scoredEntries
    .filter(([, score]) => score === topScore)
    .map(([categoryId]) => categoryId);

  for (let index = categoryTrail.length - 1; index >= 0; index -= 1) {
    const categoryId = categoryTrail[index];
    if (tiedIds.includes(categoryId)) {
      return categoryId;
    }
  }

  return tiedIds[0] || null;
}

function renderStorySlide() {
  const total = STORY_SLIDES.length || 1;
  ui.storyText.textContent = STORY_SLIDES[storyIndex] || "";
  ui.storyIndex.textContent = `${storyIndex + 1} / ${total}`;
  ui.storyPrev.disabled = storyIndex === 0;
  ui.storyNext.textContent = storyIndex === total - 1 ? "Vai al quiz" : "Continua";
  setProgress(ui.storyProgress, ((storyIndex + 1) / total) * 100);
}

function showStory() {
  storyIndex = 0;
  renderStorySlide();
  setScene("story");
}

function updateQuestionMeta(questionId) {
  const isPrimaryQuestion = questionId.startsWith("p");
  if (isPrimaryQuestion) {
    currentPrimaryIndex = primaryQuestionIds.indexOf(questionId);
  }

  const position = Math.max(currentPrimaryIndex + 1, 1);
  ui.questionCounter.textContent = `${position} / ${primaryQuestionIds.length}`;
  ui.questionMeta.textContent = isPrimaryQuestion ? "Nodo narrativo" : "Approfondimento";
  ui.tapHint.textContent = QUIZ_CONTENT.tapToContinueLabel || "Tocca per continuare";
  setProgress(ui.questionProgress, (completedPrimaryCount / Math.max(primaryQuestionIds.length, 1)) * 100);
}

function shuffleAnswers(question) {
  const answers = [...(question.answers || [])];
  if (answers.length < 2) {
    return answers;
  }

  const previousOrder = lastAnswerOrders.get(question.id) ?? answers.map((answer) => answer.label).join("|");
  let shuffled = answers;
  let attempts = 0;

  do {
    shuffled = [...answers];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    attempts += 1;
  } while (shuffled.map((answer) => answer.label).join("|") === previousOrder && attempts < 8);

  lastAnswerOrders.set(question.id, shuffled.map((answer) => answer.label).join("|"));
  return shuffled;
}

function createAnswerButton(answer, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "answer-button";
  button.innerHTML = `
    <span class="answer-order">${formatCount(index + 1)}</span>
    <span class="answer-label">${answer.label || ""}</span>
  `;
  button.addEventListener("click", () => handleAnswer(answer, button));
  return button;
}

function renderQuestion(questionId) {
  const question = quizQuestions.get(questionId);
  currentQuestionId = questionId;
  activeAnswerButton = null;

  if (!question) {
    finishQuiz();
    return;
  }

  updateQuestionMeta(questionId);
  ui.questionText.textContent = question.text || "";

  const buttons = shuffleAnswers(question).map((answer, index) => createAnswerButton(answer, index));
  ui.answerGrid.replaceChildren(...buttons);
}

function showFeedback(text, nextId, completesQuiz) {
  pendingNextId = nextId || null;
  pendingCompletesQuiz = Boolean(completesQuiz);
  ui.feedbackText.textContent = text;
  ui.feedbackHint.textContent = QUIZ_CONTENT.tapToContinueLabel || "Tocca per continuare";
  ui.feedbackOverlay.hidden = false;
  ui.overlayDismiss.focus();
}

function closeFeedback() {
  ui.feedbackOverlay.hidden = true;

  if (pendingNextId) {
    const nextId = pendingNextId;
    pendingNextId = null;
    pendingCompletesQuiz = false;
    renderQuestion(nextId);
    return;
  }

  if (pendingCompletesQuiz) {
    pendingCompletesQuiz = false;
    finishQuiz();
  }
}

function handleAnswer(answer, button) {
  if (activeAnswerButton) {
    activeAnswerButton.classList.remove("is-selected");
  }

  activeAnswerButton = button;
  button.classList.add("is-selected");

  const isPrimaryQuestion = currentQuestionId?.startsWith("p");
  if (isPrimaryQuestion) {
    completedPrimaryCount += 1;
  }

  trackCategoryAnswer(currentQuestionId, answer);
  updateQuestionMeta(currentQuestionId);

  if (answer.feedback) {
    showFeedback(answer.feedback, answer.nextId, !answer.nextId);
    return;
  }

  if (answer.nextId) {
    renderQuestion(answer.nextId);
    return;
  }

  finishQuiz();
}

function renderCompletionProfile(category) {
  const hasCategory = Boolean(category);
  ui.completionProfileCard.hidden = !hasCategory;

  if (!hasCategory) {
    ui.completionProfileTitle.textContent = "";
    ui.completionProfileDescription.textContent = "";
    ui.completionProfileBadge.textContent = "";
    return;
  }

  ui.completionProfileTitle.textContent = category.title || "";
  ui.completionProfileDescription.textContent = category.description || "";
  ui.completionProfileBadge.innerHTML = createIconMarkup(category.iconSrc, category.iconAlt, (category.shortLabel || category.title || "?").slice(0, 2).toUpperCase());
}

function finishQuiz() {
  resolvedCategoryId = resolveCategoryId();
  persistHomeProfile(resolvedCategoryId);

  const category = resolvedCategoryId ? MISSION_HOME_CONTENT.categories?.[resolvedCategoryId] : null;
  ui.completionKicker.textContent = MISSION_ZERO_RESULT_CONTENT.kicker || "Missione completata";
  ui.completionTitleText.textContent =
    MISSION_ZERO_RESULT_CONTENT.title || QUIZ_CONTENT.completion?.title || "Percorso avviato";
  ui.completionText.textContent =
    MISSION_ZERO_RESULT_CONTENT.text || QUIZ_CONTENT.completion?.text || "";
  ui.completionNote.textContent = MISSION_ZERO_RESULT_CONTENT.cardNote || "";
  ui.completionNote.hidden = !MISSION_ZERO_RESULT_CONTENT.cardNote;
  ui.completionHomeButton.textContent = MISSION_ZERO_RESULT_CONTENT.homeButtonLabel || "Apri la home";

  ui.completionVisual.hidden = false;

  renderCompletionProfile(category);
  setProgress(ui.questionProgress, 100);
  setScene("complete");
}

function getSectionContent(sectionKey, categoryId) {
  if (sectionKey === "general") {
    return MISSION_HOME_CONTENT.missions?.general || [];
  }

  if (sectionKey === "locations") {
    return MISSION_HOME_CONTENT.missions?.locations || [];
  }

  return MISSION_HOME_CONTENT.missions?.byCategory?.[categoryId] || [];
}

function getRecommendedMissions(sectionKey, categoryId) {
  const missions = getSectionContent(sectionKey, categoryId);
  const recommended = missions.filter((mission) => mission.recommended);
  return (recommended.length ? recommended : missions).slice(0, 2);
}

function getSectionConfig(sectionKey) {
  return MISSION_HOME_CONTENT.sections?.[sectionKey] || {};
}

function createMissionCard(mission) {
  const card = document.createElement("article");
  card.className = "mission-row";

  const filters = Array.isArray(mission.filters) ? mission.filters : [];
  const filterMarkup = filters.length
    ? `<div class="mission-row__filters">${filters
        .map((filter) => `<span class="mission-tag">${filter}</span>`)
        .join("")}</div>`
    : "";
  const badgeText = (mission.meta || mission.title || "M")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase() || "M";
  const iconMarkup = createIconMarkup(mission.iconSrc, mission.iconAlt, badgeText);

  card.innerHTML = `
    <div class="mission-row__icon" aria-hidden="true">${iconMarkup}</div>
    <div class="mission-row__body">
      <div class="mission-row__meta">${mission.meta || ""}</div>
      <h3 class="mission-row__title">${mission.title || ""}</h3>
      <p class="mission-row__description">${mission.description || ""}</p>
      ${filterMarkup}
    </div>
    <div class="mission-row__arrow" aria-hidden="true">›</div>
  `;

  return card;
}

function renderMissionList(container, missions) {
  const items = Array.isArray(missions) ? missions : [];
  container.replaceChildren(...items.map((mission) => createMissionCard(mission)));
}

function renderHomeProfile(category) {
  if (!category) {
    ui.homeProfileChip.hidden = true;
    ui.homeProfileBadge.textContent = "";
    ui.homeProfileChipTitle.textContent = "";
    ui.homeProfileTitle.textContent = MISSION_HOME_CONTENT.profileCard?.fallbackTitle || "Profilo in attesa";
    ui.homeProfileText.textContent = MISSION_HOME_CONTENT.profileCard?.fallbackText || "";
    return;
  }

  ui.homeProfileTitle.textContent = category.title || "";
  ui.homeProfileText.textContent = category.description || "";
  ui.homeProfileChip.hidden = false;
  ui.homeProfileChipTitle.textContent = category.shortLabel || category.title || "";
  ui.homeProfileBadge.innerHTML = createIconMarkup(category.iconSrc, category.iconAlt, (category.shortLabel || category.title || "?").slice(0, 2).toUpperCase());
}

function renderHome() {
  const categoryId = resolvedCategoryId || getStoredCategoryId();
  const category = categoryId ? MISSION_HOME_CONTENT.categories?.[categoryId] : null;
  const generalMissions = MISSION_HOME_CONTENT.missions?.general || [];
  const locationMissions = MISSION_HOME_CONTENT.missions?.locations || [];
  const personalMissions = MISSION_HOME_CONTENT.missions?.byCategory?.[categoryId] || [];
  const recommendedGeneral = getRecommendedMissions("general", categoryId);
  const recommendedLocations = getRecommendedMissions("locations", categoryId);
  const recommendedPersonal = getRecommendedMissions("personal", categoryId);
  const totalRecommended = recommendedGeneral.length + recommendedLocations.length + recommendedPersonal.length;

  ui.homeTitle.textContent = MISSION_HOME_CONTENT.hero?.title || "Le tue missioni";
  ui.homeText.textContent = MISSION_HOME_CONTENT.hero?.text || "";
  ui.homeOverviewText.textContent = MISSION_HOME_CONTENT.overview?.text || "";

  ui.homeNavGeneralLabel.textContent = MISSION_HOME_CONTENT.sections?.general?.anchorLabel || "Generali";
  ui.homeNavLocationsLabel.textContent = MISSION_HOME_CONTENT.sections?.locations?.anchorLabel || "Luoghi";
  ui.homeNavPersonalLabel.textContent = MISSION_HOME_CONTENT.sections?.personal?.anchorLabel || "Profilo";
  ui.homeNavGeneralCount.textContent = formatCount(recommendedGeneral.length);
  ui.homeNavLocationsCount.textContent = formatCount(recommendedLocations.length);
  ui.homeNavPersonalCount.textContent = formatCount(recommendedPersonal.length);

  ui.totalMissionLabel.textContent = MISSION_HOME_CONTENT.overview?.stats?.totalLabel || "Missioni raccomandate";
  ui.totalMissionCount.textContent = formatCount(totalRecommended);
  ui.generalMissionLabel.textContent = MISSION_HOME_CONTENT.overview?.stats?.generalLabel || "Generali";
  ui.generalMissionCount.textContent = formatCount(recommendedGeneral.length);
  ui.locationMissionLabel.textContent = MISSION_HOME_CONTENT.overview?.stats?.locationLabel || "Luoghi";
  ui.locationMissionCount.textContent = formatCount(recommendedLocations.length);
  ui.personalMissionLabel.textContent = MISSION_HOME_CONTENT.overview?.stats?.personalLabel || "Profilo";
  ui.personalMissionCount.textContent = formatCount(recommendedPersonal.length);

  renderHomeProfile(category);

  ui.generalPanelTitle.textContent = MISSION_HOME_CONTENT.sections?.general?.title || "Missioni generali";
  ui.generalPanelText.textContent = MISSION_HOME_CONTENT.sections?.general?.text || "";
  ui.generalSectionCount.textContent = `${generalMissions.length} totali`;
  renderMissionList(ui.generalMissionList, recommendedGeneral);

  ui.locationPanelTitle.textContent = MISSION_HOME_CONTENT.sections?.locations?.title || "Missioni luogo";
  ui.locationPanelText.textContent = MISSION_HOME_CONTENT.sections?.locations?.text || "";
  ui.locationSectionCount.textContent = `${locationMissions.length} totali`;
  renderMissionList(ui.locationMissionList, recommendedLocations);

  ui.personalPanelTitle.textContent = MISSION_HOME_CONTENT.sections?.personal?.title || "Missioni profilo";
  ui.personalPanelText.textContent = MISSION_HOME_CONTENT.sections?.personal?.text || "";
  ui.personalSectionCount.textContent = `${personalMissions.length} totali`;
  renderMissionList(ui.personalMissionList, recommendedPersonal);
}

function renderDetailFilters(missions) {
  const uniqueFilters = Array.from(new Set(missions.flatMap((mission) => mission.filters || [])));
  const filters = ["all", ...uniqueFilters];

  ui.detailFilterRow.replaceChildren(
    ...filters.map((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-chip${filter === activeDetailFilter ? " is-active" : ""}`;
      button.textContent = filter === "all" ? "Tutte" : filter;
      button.addEventListener("click", () => {
        activeDetailFilter = filter;
        renderCategoryDetail();
      });
      return button;
    })
  );
}

function renderCategoryDetail() {
  const categoryId = resolvedCategoryId || getStoredCategoryId();
  const section = getSectionConfig(activeDetailSection);
  const missions = getSectionContent(activeDetailSection, categoryId);
  const filteredMissions =
    activeDetailFilter === "all"
      ? missions
      : missions.filter((mission) => (mission.filters || []).includes(activeDetailFilter));

  ui.detailTitle.textContent = section.detailTitle || section.title || "Archivio missioni";
  ui.detailText.textContent = section.text || "";
  ui.detailFilterTitle.textContent = MISSION_HOME_CONTENT.detailView?.filterTitle || "Filtra le missioni";
  ui.detailCategoryCount.textContent = `${missions.length} missioni`;
  ui.detailResultsCount.textContent = `${filteredMissions.length} risultati`;
  ui.detailEmptyTitle.textContent = MISSION_HOME_CONTENT.detailView?.emptyTitle || "Nessuna missione";
  ui.detailEmptyText.textContent = MISSION_HOME_CONTENT.detailView?.emptyText || "";

  renderDetailFilters(missions);
  renderMissionList(ui.detailMissionList, filteredMissions);

  const isEmpty = filteredMissions.length === 0;
  ui.detailMissionList.hidden = isEmpty;
  ui.detailEmptyState.hidden = !isEmpty;
}

function openCategoryDetail(sectionKey) {
  activeDetailSection = sectionKey;
  activeDetailFilter = "all";
  renderCategoryDetail();
  setScene("categoryDetail");
}

function showHome() {
  if (!isHomeUnlocked()) {
    setScene("entry");
    return;
  }

  resolvedCategoryId = resolvedCategoryId || getStoredCategoryId();
  renderHome();
  setScene("home");
}

function resetQuizState() {
  currentQuestionId = null;
  currentPrimaryIndex = 0;
  completedPrimaryCount = 0;
  pendingNextId = null;
  pendingCompletesQuiz = false;
  resolvedCategoryId = null;
  categoryScores = {};
  categoryTrail = [];
  activeAnswerButton = null;
  ui.feedbackOverlay.hidden = true;
}

function showMission() {
  resetQuizState();
  ui.missionTitle.textContent = QUIZ_CONTENT.introTitle || "Missione 0";
  ui.missionIntro.textContent = QUIZ_CONTENT.introText || "";
  ui.tapHint.textContent = QUIZ_CONTENT.tapToContinueLabel || "Tocca per continuare";
  renderQuestion(QUIZ_CONTENT.startQuestionId);
  setScene("mission");
}

function restartExperience() {
  storyIndex = 0;
  resetQuizState();
  renderStorySlide();
  window.location.hash = "";
  setScene("entry");
}

function syncSceneWithHash() {
  const hash = window.location.hash;

  if (hash === "#missione-0") {
    showMission();
    return;
  }

  if (hash === (MISSION_ZERO_RESULT_CONTENT.homeRoute || "#home") && isHomeUnlocked()) {
    resolvedCategoryId = getStoredCategoryId();
    showHome();
    return;
  }

  setScene("entry");
}

ui.enterButton.addEventListener("click", showStory);
ui.jumpToMissionButton.addEventListener("click", () => {
  window.location.hash = "#missione-0";
  showMission();
});

ui.storyPrev.addEventListener("click", () => {
  if (storyIndex === 0) {
    return;
  }

  storyIndex -= 1;
  renderStorySlide();
});

ui.storyNext.addEventListener("click", () => {
  if (storyIndex < STORY_SLIDES.length - 1) {
    storyIndex += 1;
    renderStorySlide();
    return;
  }

  window.location.hash = "#missione-0";
  showMission();
});

ui.overlayDismiss.addEventListener("click", closeFeedback);
ui.feedbackOverlay.addEventListener("click", (event) => {
  if (event.target === ui.feedbackOverlay) {
    closeFeedback();
  }
});

ui.completionHomeButton.addEventListener("click", () => {
  window.location.hash = MISSION_ZERO_RESULT_CONTENT.homeRoute || "#home";
  showHome();
});

ui.restartButton.addEventListener("click", restartExperience);
ui.generalOpenButton.addEventListener("click", () => openCategoryDetail("general"));
ui.locationOpenButton.addEventListener("click", () => openCategoryDetail("locations"));
ui.personalOpenButton.addEventListener("click", () => openCategoryDetail("personal"));
ui.detailBackButton.addEventListener("click", showHome);

ui.archiveButtons.forEach((button) => {
  button.addEventListener("click", () => openCategoryDetail(button.dataset.section || "general"));
});

window.addEventListener("keydown", (event) => {
  if (!ui.feedbackOverlay.hidden && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    closeFeedback();
    return;
  }

  if (currentScene === "story" && event.key === "ArrowRight") {
    ui.storyNext.click();
  }

  if (currentScene === "story" && event.key === "ArrowLeft") {
    ui.storyPrev.click();
  }
});

window.addEventListener("hashchange", syncSceneWithHash);

window.addEventListener("DOMContentLoaded", () => {
  renderStorySlide();
  syncSceneWithHash();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
