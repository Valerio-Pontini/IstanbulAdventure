const APP_TEXT = window.APP_TEXT?.it ?? {};
const APP_CONTENT = window.APP_CONTENT ?? {};
const QUIZ_CONTENT = window.QUIZ_CONTENT ?? {};
const MISSION_ZERO_RESULT_CONTENT = window.MISSION_ZERO_RESULT_CONTENT ?? {};
const MISSION_HOME_CONTENT = window.MISSION_HOME_CONTENT ?? {};
const UI_TEXT = APP_TEXT.ui ?? {};

const STORY_SLIDES = APP_CONTENT.storySlides ?? [];
const quizQuestions = new Map((QUIZ_CONTENT.questions ?? []).map((question) => [question.id, question]));
const primaryQuestionIds = (QUIZ_CONTENT.questions ?? [])
  .filter((question) => question.id.startsWith("p"))
  .map((question) => question.id);

const STORAGE_KEYS = {
  homeUnlocked: "istanbulAdventure.homeUnlocked",
  categoryId: "istanbulAdventure.categoryId",
  userMissionState: "istanbulAdventure.userMissionState"
};

const ui = {
  scenes: {
    entry: document.getElementById("scene-entry"),
    story: document.getElementById("scene-story"),
    mission: document.getElementById("scene-mission"),
    complete: document.getElementById("scene-complete"),
    home: document.getElementById("scene-home"),
    categoryDetail: document.getElementById("scene-category-detail"),
    missionDetail: document.getElementById("scene-mission-detail")
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
  detailSearchInput: document.getElementById("detailSearchInput"),
  detailSearchClear: document.getElementById("detailSearchClear"),
  detailFilterGroups: document.getElementById("detailFilterGroups"),
  detailResultsCount: document.getElementById("detailResultsCount"),
  detailMissionList: document.getElementById("detailMissionList"),
  detailEmptyState: document.getElementById("detailEmptyState"),
  detailEmptyTitle: document.getElementById("detailEmptyTitle"),
  detailEmptyText: document.getElementById("detailEmptyText"),
  missionDetailBackButton: document.getElementById("missionDetailBackButton"),
  missionDetailEyebrow: document.getElementById("missionDetailEyebrow"),
  missionDetailIcon: document.getElementById("missionDetailIcon"),
  missionDetailMeta: document.getElementById("missionDetailMeta"),
  missionDetailTitle: document.getElementById("missionDetailTitle"),
  missionDetailDescription: document.getElementById("missionDetailDescription"),
  missionDetailSummary: document.getElementById("missionDetailSummary"),
  missionDetailTagsLabel: document.getElementById("missionDetailTagsLabel"),
  missionDetailTags: document.getElementById("missionDetailTags"),
  missionDetailObjectiveTitle: document.getElementById("missionDetailObjectiveTitle"),
  missionDetailFlowTitle: document.getElementById("missionDetailFlowTitle"),
  missionDetailFlowCount: document.getElementById("missionDetailFlowCount"),
  missionDetailIntro: document.getElementById("missionDetailIntro"),
  missionDetailObjectives: document.getElementById("missionDetailObjectives"),
  missionDetailSteps: document.getElementById("missionDetailSteps"),
  missionDetailInfoSection: document.getElementById("missionDetailInfoSection"),
  missionDetailInfoTitle: document.getElementById("missionDetailInfoTitle"),
  missionDetailInfo: document.getElementById("missionDetailInfo"),
  missionDetailSequenceSection: document.getElementById("missionDetailSequenceSection"),
  missionDetailSequenceTitle: document.getElementById("missionDetailSequenceTitle"),
  missionDetailSequenceCard: document.getElementById("missionDetailSequenceCard"),
  missionSaveButton: document.getElementById("missionSaveButton"),
  missionCompleteButton: document.getElementById("missionCompleteButton"),
  missionNextButton: document.getElementById("missionNextButton"),
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
let activeDetailFilters = createDefaultDetailFilters();
let activeMissionId = null;
let missionDetailBackScene = "home";
let categoryScores = {};
let categoryTrail = [];
let activeAnswerButton = null;
const lastAnswerOrders = new Map();

function getNestedValue(source, path) {
  if (!source || !path) {
    return undefined;
  }

  return path.split(".").reduce((value, key) => value?.[key], source);
}

function getUiText(path, fallback = "") {
  return getNestedValue(UI_TEXT, path) ?? fallback;
}

function formatLabeledCount(count, suffixPath, fallbackSuffix) {
  return `${count} ${getUiText(suffixPath, fallbackSuffix)}`;
}

function applyStaticText() {
  document.querySelectorAll("[data-text-key]").forEach((element) => {
    const text = getNestedValue(UI_TEXT.static, element.dataset.textKey);
    if (typeof text === "string") {
      element.textContent = text;
    }
  });

  document.title = getUiText("document.title", document.title);

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", getUiText("document.description", descriptionMeta.getAttribute("content") || ""));
  }

  ui.enterButton.textContent = getUiText("actions.enterMission", ui.enterButton.textContent);
  ui.jumpToMissionButton.textContent = getUiText("actions.jumpToQuiz", ui.jumpToMissionButton.textContent);
  ui.storyPrev.textContent = getUiText("actions.storyPrev", ui.storyPrev.textContent);
  ui.storyNext.textContent = getUiText("actions.storyNext", ui.storyNext.textContent);
  ui.completionHomeButton.textContent = MISSION_ZERO_RESULT_CONTENT.homeButtonLabel || getUiText("actions.openHome", ui.completionHomeButton.textContent);
  ui.restartButton.textContent = getUiText("actions.restart", ui.restartButton.textContent);
  ui.generalOpenButton.textContent = getUiText("actions.openArchive", ui.generalOpenButton.textContent);
  ui.locationOpenButton.textContent = getUiText("actions.openArchive", ui.locationOpenButton.textContent);
  ui.personalOpenButton.textContent = getUiText("actions.openArchive", ui.personalOpenButton.textContent);
  ui.detailBackButton.textContent = MISSION_HOME_CONTENT.detailView?.backLabel || getUiText("actions.backToHome", ui.detailBackButton.textContent);
  ui.missionDetailBackButton.textContent = MISSION_HOME_CONTENT.missionDetail?.backLabel || getUiText("actions.backToHome", ui.missionDetailBackButton.textContent);
  ui.overlayDismiss.textContent = getUiText("actions.dismissOverlay", ui.overlayDismiss.textContent);
}

function setScene(sceneName) {
  currentScene = sceneName;
  document.body.dataset.scene = sceneName;

  Object.entries(ui.scenes).forEach(([name, element]) => {
    const isActive = name === sceneName;
    element.classList.toggle("is-active", isActive);
    element.hidden = !isActive;
  });

  const labels = {
    entry: getUiText("scenes.entry", "Ingresso"),
    story: getUiText("scenes.story", "Prologo"),
    mission: getUiText("scenes.mission", "Missione 0"),
    complete: getUiText("scenes.complete", "Esito"),
    home: MISSION_HOME_CONTENT.statusLabel || getUiText("scenes.homeFallback", "Home missioni"),
    categoryDetail: getUiText("scenes.categoryDetail", "Archivio missioni"),
    missionDetail: getUiText("scenes.missionDetail", "Dettaglio missione")
  };

  ui.statusPill.textContent = labels[sceneName] || getUiText("document.title", "Istanbul Adventure");
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

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function createDefaultDetailFilters() {
  return {
    search: "",
    place: "all",
    type: "all",
    theme: "all",
    difficulty: "all",
    budget: "all",
    duration: "all"
  };
}

function getDefaultUserMissionState() {
  return {
    completedMissionIds: [],
    savedMissionIds: [],
    hiddenMissionIds: [],
    personality: getStoredCategoryId() || undefined
  };
}

function getUserMissionState() {
  const fallback = getDefaultUserMissionState();
  const rawState = window.localStorage.getItem(STORAGE_KEYS.userMissionState);

  if (!rawState) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawState);
    return {
      completedMissionIds: Array.isArray(parsed.completedMissionIds) ? parsed.completedMissionIds : [],
      savedMissionIds: Array.isArray(parsed.savedMissionIds) ? parsed.savedMissionIds : [],
      hiddenMissionIds: Array.isArray(parsed.hiddenMissionIds) ? parsed.hiddenMissionIds : [],
      personality: parsed.personality || fallback.personality
    };
  } catch (error) {
    return fallback;
  }
}

function persistUserMissionState(nextState) {
  window.localStorage.setItem(STORAGE_KEYS.userMissionState, JSON.stringify(nextState));
}

function updateUserMissionState(updater) {
  const currentState = getUserMissionState();
  const nextState = updater(currentState);
  persistUserMissionState(nextState);
  return nextState;
}

function toggleMissionStateValue(stateKey, missionId) {
  return updateUserMissionState((currentState) => {
    const values = new Set(currentState[stateKey] || []);
    if (values.has(missionId)) {
      values.delete(missionId);
    } else {
      values.add(missionId);
    }

    return {
      ...currentState,
      [stateKey]: Array.from(values)
    };
  });
}

function getCurrentCategoryId() {
  return resolvedCategoryId || getStoredCategoryId() || getUserMissionState().personality || null;
}

function persistHomeProfile(categoryId) {
  window.localStorage.setItem(STORAGE_KEYS.homeUnlocked, "true");
  window.localStorage.setItem(STORAGE_KEYS.categoryId, categoryId || "");
  updateUserMissionState((currentState) => ({
    ...currentState,
    personality: categoryId || currentState.personality
  }));
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
  ui.storyNext.textContent =
    storyIndex === total - 1
      ? getUiText("actions.storyFinish", "Vai al quiz")
      : getUiText("actions.storyNext", "Continua");
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
  ui.questionMeta.textContent = isPrimaryQuestion
    ? getUiText("quiz.primaryQuestionLabel", "Nodo narrativo")
    : getUiText("quiz.branchQuestionLabel", "Approfondimento");
  ui.tapHint.textContent = QUIZ_CONTENT.tapToContinueLabel || getUiText("quiz.tapHint", "Tocca per continuare");
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
  ui.feedbackHint.textContent = QUIZ_CONTENT.tapToContinueLabel || getUiText("quiz.tapHint", "Tocca per continuare");
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
  ui.completionKicker.textContent = MISSION_ZERO_RESULT_CONTENT.kicker || getUiText("scenes.complete", "Missione completata");
  ui.completionTitleText.textContent =
    MISSION_ZERO_RESULT_CONTENT.title || QUIZ_CONTENT.completion?.title || "Percorso avviato";
  ui.completionText.textContent =
    MISSION_ZERO_RESULT_CONTENT.text || QUIZ_CONTENT.completion?.text || "";
  ui.completionNote.textContent = MISSION_ZERO_RESULT_CONTENT.cardNote || "";
  ui.completionNote.hidden = !MISSION_ZERO_RESULT_CONTENT.cardNote;
  ui.completionHomeButton.textContent = MISSION_ZERO_RESULT_CONTENT.homeButtonLabel || getUiText("actions.openHome", "Apri la home");

  ui.completionVisual.hidden = false;

  renderCompletionProfile(category);
  setProgress(ui.questionProgress, 100);
  setScene("complete");
}

function getSectionContent(sectionKey, categoryId) {
  const userState = getUserMissionState();
  const hiddenMissionIds = new Set(userState.hiddenMissionIds || []);

  if (sectionKey === "general") {
    return sortMissions(
      (MISSION_HOME_CONTENT.missions?.general || [])
        .filter((mission) => !hiddenMissionIds.has(mission.id))
        .filter((mission) => isMissionVisibleForCategory(mission, categoryId)),
      categoryId,
      userState
    );
  }

  if (sectionKey === "locations") {
    return sortMissions(
      (MISSION_HOME_CONTENT.missions?.locations || [])
        .filter((mission) => !hiddenMissionIds.has(mission.id))
        .filter((mission) => isMissionVisibleForCategory(mission, categoryId)),
      categoryId,
      userState
    );
  }

  return sortMissions(
    (MISSION_HOME_CONTENT.missions?.byCategory?.[categoryId] || []).filter((mission) => !hiddenMissionIds.has(mission.id)),
    categoryId,
    userState
  );
}

function getRecommendedMissions(sectionKey, categoryId) {
  return getSectionContent(sectionKey, categoryId).slice(0, 2);
}

function getSectionConfig(sectionKey) {
  return MISSION_HOME_CONTENT.sections?.[sectionKey] || {};
}

function getMissionById(missionId) {
  return MISSION_HOME_CONTENT.missionIndex?.[missionId] || null;
}

function createSummaryItem(label, value) {
  const item = document.createElement("div");
  item.className = "summary-item";
  item.innerHTML = `
    <span>${label}</span>
    <strong>${value}</strong>
  `;
  return item;
}

function createMissionTag(text) {
  const tag = document.createElement("span");
  tag.className = "mission-tag";
  tag.textContent = text;
  return tag;
}

function isMissionVisibleForCategory(mission, categoryId) {
  if (!categoryId) {
    return mission.audience?.mode === "all";
  }

  return (mission.availableForCategoryIds || []).includes(categoryId);
}

function isMissionHighlightedForCategory(mission, categoryId) {
  if (!categoryId) {
    return false;
  }

  return (mission.highlightForCategoryIds || []).includes(categoryId);
}

function sortMissions(missions, categoryId, userState = getUserMissionState()) {
  const completedIds = new Set(userState.completedMissionIds || []);
  const savedIds = new Set(userState.savedMissionIds || []);

  return [...missions].sort((left, right) => {
    const leftScore =
      (isMissionHighlightedForCategory(left, categoryId) ? 40 : 0) +
      (savedIds.has(left.id) ? 20 : 0) +
      (!completedIds.has(left.id) ? 10 : 0) +
      (left.sequence?.isStart ? 5 : 0);
    const rightScore =
      (isMissionHighlightedForCategory(right, categoryId) ? 40 : 0) +
      (savedIds.has(right.id) ? 20 : 0) +
      (!completedIds.has(right.id) ? 10 : 0) +
      (right.sequence?.isStart ? 5 : 0);

    if (leftScore !== rightScore) {
      return rightScore - leftScore;
    }

    if (left.sortPriority !== right.sortPriority) {
      return left.sortPriority - right.sortPriority;
    }

    if (left.difficulty !== right.difficulty) {
      return left.difficulty - right.difficulty;
    }

    return (left.title || "").localeCompare(right.title || "", "it");
  });
}

function matchesSearch(mission, query) {
  const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return true;
  }

  return tokens.every((token) => mission.searchIndex?.includes(token));
}

function matchesFilterValue(mission, filterKey, filterValue) {
  if (filterValue === "all") {
    return true;
  }

  return mission.filterValues?.[filterKey] === filterValue;
}

function filterMissions(missions, filters) {
  return missions.filter((mission) => {
    if (!matchesSearch(mission, filters.search)) {
      return false;
    }

    return ["place", "type", "theme", "difficulty", "budget", "duration"].every((filterKey) =>
      matchesFilterValue(mission, filterKey, filters[filterKey])
    );
  });
}

function buildFilterOptions(missions, filterKey) {
  const counts = new Map();
  const labels = new Map();

  missions.forEach((mission) => {
    const value = mission.filterValues?.[filterKey];
    if (!value) {
      return;
    }

    counts.set(value, (counts.get(value) || 0) + 1);
    labels.set(value, mission.filterLabels?.[filterKey] || value);
  });

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      count,
      label: labels.get(value) || value
    }))
    .sort((left, right) => {
      if (filterKey === "difficulty") {
        return Number(left.value) - Number(right.value);
      }

      return left.label.localeCompare(right.label, "it");
    });
}

function createFilterChip(label, value, filterKey) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `filter-chip${activeDetailFilters[filterKey] === value ? " is-active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", () => {
    activeDetailFilters = {
      ...activeDetailFilters,
      [filterKey]: value
    };
    renderCategoryDetail();
  });
  return button;
}

function renderDetailFilters(missions) {
  const groups = [
    { key: "place", label: "Luogo", mode: "chips" },
    { key: "type", label: "Tipologia", mode: "chips" },
    { key: "theme", label: "Tema", mode: "select" },
    { key: "difficulty", label: "Difficoltà", mode: "select" },
    { key: "budget", label: "Budget", mode: "select" },
    { key: "duration", label: "Durata", mode: "select" }
  ];

  const chipGroups = groups.filter((group) => group.mode === "chips");
  const selectGroups = groups.filter((group) => group.mode === "select");
  const fragments = [];

  chipGroups.forEach((group) => {
    const wrapper = document.createElement("div");
    wrapper.className = "filter-group";
    const label = document.createElement("p");
    label.className = "filter-label";
    label.textContent = group.label;
    const row = document.createElement("div");
    row.className = "filter-row";
    row.append(createFilterChip("Tutte", "all", group.key));
    buildFilterOptions(missions, group.key).forEach((option) => {
      row.append(createFilterChip(option.label, option.value, group.key));
    });
    wrapper.append(label, row);
    fragments.push(wrapper);
  });

  const selectGrid = document.createElement("div");
  selectGrid.className = "filter-select-grid";
  selectGroups.forEach((group) => {
    const wrapper = document.createElement("label");
    wrapper.className = "filter-group";
    const label = document.createElement("span");
    label.className = "filter-label";
    label.textContent = group.label;
    const select = document.createElement("select");
    select.className = "filter-select";
    select.innerHTML = `<option value="all">Tutte</option>`;
    buildFilterOptions(missions, group.key).forEach((option) => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      if (activeDetailFilters[group.key] === option.value) {
        element.selected = true;
      }
      select.append(element);
    });
    select.value = activeDetailFilters[group.key];
    select.addEventListener("change", () => {
      activeDetailFilters = {
        ...activeDetailFilters,
        [group.key]: select.value
      };
      renderCategoryDetail();
    });
    wrapper.append(label, select);
    selectGrid.append(wrapper);
  });
  fragments.push(selectGrid);

  ui.detailFilterGroups.replaceChildren(...fragments);
  ui.detailSearchInput.value = activeDetailFilters.search;
}

function createMissionCard(mission, userState, categoryId) {
  const card = document.createElement("article");
  const isCompleted = (userState.completedMissionIds || []).includes(mission.id);
  const isSaved = (userState.savedMissionIds || []).includes(mission.id);
  const visibleTags = [
    mission.themeLabel,
    mission.sequence?.isSequential ? mission.sequence.statusLabel : null,
    isMissionHighlightedForCategory(mission, categoryId) ? "Per te" : null,
    isSaved ? "Salvata" : null,
    isCompleted ? "Completata" : null
  ].filter(Boolean);

  card.className = `mission-row${isCompleted ? " is-completed" : ""}`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
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
      <div class="mission-row__facts">
        <span class="mission-fact">${mission.difficultyLabel || ""}</span>
        <span class="mission-fact">${mission.durationLabel || ""}</span>
        <span class="mission-fact">${mission.budgetLabel || ""}</span>
        <span class="mission-fact">${mission.points || 0} pt</span>
      </div>
      <div class="mission-row__filters">${visibleTags.map((filter) => `<span class="mission-tag">${filter}</span>`).join("")}</div>
    </div>
    <div class="mission-row__arrow" aria-hidden="true">›</div>
  `;

  card.addEventListener("click", () => openMissionDetail(mission.id));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMissionDetail(mission.id);
    }
  });
  return card;
}

function renderMissionList(container, missions) {
  const items = Array.isArray(missions) ? missions : [];
  const userState = getUserMissionState();
  const categoryId = getCurrentCategoryId();
  container.replaceChildren(...items.map((mission) => createMissionCard(mission, userState, categoryId)));
}

function renderMissionDetail(mission) {
  if (!mission) {
    return;
  }

  const detailCopy = MISSION_HOME_CONTENT.missionDetail || {};
  const iconFallback = (mission.meta || mission.title || "M").replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "M";
  const userState = getUserMissionState();
  const isSaved = (userState.savedMissionIds || []).includes(mission.id);
  const isCompleted = (userState.completedMissionIds || []).includes(mission.id);
  const summaryItems = [
    [detailCopy.summaryLocation || "Luogo", mission.locationLabel || ""],
    [detailCopy.summaryType || "Tipologia", mission.typeLabel || ""],
    [detailCopy.summaryDifficulty || "Difficoltà", mission.difficultyLabel || ""],
    [detailCopy.summaryDuration || "Durata", mission.durationLabel || ""],
    [detailCopy.summaryBudget || "Budget", mission.budgetLabel || ""],
    [detailCopy.summaryPoints || "Punteggio", `${mission.points || 0} pt`]
  ];
  const tags = [mission.themeLabel, ...(mission.secondaryThemeLabels || [])].filter(Boolean);
  const introChildren = [];
  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.className = "page-copy page-copy-tight";
  descriptionParagraph.textContent = mission.description || "";
  introChildren.push(descriptionParagraph);
  if (mission.discovery) {
    const discoveryParagraph = document.createElement("p");
    discoveryParagraph.className = "page-copy page-copy-tight";
    discoveryParagraph.textContent = mission.discovery;
    introChildren.push(discoveryParagraph);
  }
  const editorialItems = [
    mission.groupText ? `Gruppo editoriale: ${mission.groupText}` : null,
    mission.audience?.label ? `Accesso: ${mission.audience.label}` : null
  ].filter(Boolean);
  const flowCards = [
    {
      meta: mission.completionLabel || "Completamento",
      title: mission.completionLabel || "Completamento",
      description: mission.validationCriteria?.length
        ? mission.validationCriteria[0]
        : mission.description || "",
      footer: mission.validationType || "Verifica locale"
    },
    ...(mission.validationCriteria || []).slice(1).map((criterion, index) => ({
      meta: "Criterio",
      title: `Passaggio ${index + 2}`,
      description: criterion,
      footer: mission.completionLabel || "Verifica"
    }))
  ];

  ui.missionDetailEyebrow.textContent = mission.sequence?.isSequential ? mission.sequence.statusLabel : "Missione";
  ui.missionDetailMeta.textContent = mission.meta || mission.typeLabel || "Missione";
  ui.missionDetailTitle.textContent = mission.title || "";
  ui.missionDetailDescription.textContent = mission.groupText || mission.themeLabel || "";
  ui.missionDetailIcon.innerHTML = createIconMarkup(mission.iconSrc, mission.iconAlt, iconFallback);
  ui.missionDetailTagsLabel.textContent = detailCopy.tagsLabel || "Tag di lettura";
  ui.missionDetailObjectiveTitle.textContent = detailCopy.objectiveTitle || "La missione";
  ui.missionDetailFlowTitle.textContent = detailCopy.flowTitle || "Flusso di completamento";
  ui.missionDetailFlowCount.textContent = `${flowCards.length} ${detailCopy.flowSingle || "passaggi"}`;
  ui.missionDetailInfoTitle.textContent = detailCopy.infoTitle || "Approfondimento";
  ui.missionDetailSequenceTitle.textContent = detailCopy.sequenceTitle || "Sequenza";
  ui.missionSaveButton.textContent = isSaved ? detailCopy.savedLabel || "Salvata" : detailCopy.saveLabel || "Salva";
  ui.missionCompleteButton.textContent = isCompleted
    ? detailCopy.completedLabel || "Completata"
    : detailCopy.completeLabel || "Segna come fatta";
  ui.missionNextButton.textContent = mission.sequence?.hasNext ? detailCopy.nextLabel || "Missione successiva" : detailCopy.noNextLabel || "Fine sequenza";
  ui.missionNextButton.hidden = !mission.sequence?.hasNext;

  ui.missionDetailSummary.replaceChildren(...summaryItems.map(([label, value]) => createSummaryItem(label, value)));
  ui.missionDetailTags.replaceChildren(...tags.map((filter) => createMissionTag(filter)));
  ui.missionDetailIntro.replaceChildren(...introChildren);
  ui.missionDetailObjectives.replaceChildren(
    ...editorialItems.map((objective) => {
      const item = document.createElement("li");
      item.textContent = objective;
      return item;
    })
  );

  ui.missionDetailSteps.replaceChildren(
    ...(flowCards.map((step, index) => {
      const article = document.createElement("article");
      article.className = "mission-step";
      article.innerHTML = `
        <div class="mission-step__index">${formatCount(index + 1)}</div>
        <div class="mission-step__body">
          <div class="mission-step__meta">${step.meta || ""}</div>
          <h4 class="mission-step__title">${step.title || ""}</h4>
          <p class="mission-step__description">${step.description || ""}</p>
          <div class="mission-step__footer">
            <span class="mission-tag">${step.footer || ""}</span>
          </div>
        </div>
      `;
      return article;
    }))
  );

  if (mission.information) {
    const infoParagraph = document.createElement("p");
    infoParagraph.className = "page-copy page-copy-tight";
    infoParagraph.textContent = mission.information;
    ui.missionDetailInfo.replaceChildren(infoParagraph);
    ui.missionDetailInfoSection.hidden = false;
  } else {
    ui.missionDetailInfo.replaceChildren();
    ui.missionDetailInfoSection.hidden = true;
  }

  if (mission.sequence?.isSequential) {
    ui.missionDetailSequenceCard.innerHTML = `
      <p class="mission-row__meta">${mission.sequence.name || ""}</p>
      <p class="sequence-card__title">${mission.sequence.statusLabel || ""}</p>
      <p class="sequence-card__text">${mission.sequence.hasNext ? "Questa missione apre il passaggio successivo del filone." : "Questa missione chiude il filone disponibile."}</p>
    `;
    ui.missionDetailSequenceSection.hidden = false;
  } else {
    ui.missionDetailSequenceCard.replaceChildren();
    ui.missionDetailSequenceSection.hidden = true;
  }
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
  const categoryId = getCurrentCategoryId();
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
  ui.generalSectionCount.textContent = formatLabeledCount(generalMissions.length, "counts.totalsSuffix", "totali");
  renderMissionList(ui.generalMissionList, recommendedGeneral);

  ui.locationPanelTitle.textContent = MISSION_HOME_CONTENT.sections?.locations?.title || "Missioni luogo";
  ui.locationPanelText.textContent = MISSION_HOME_CONTENT.sections?.locations?.text || "";
  ui.locationSectionCount.textContent = formatLabeledCount(locationMissions.length, "counts.totalsSuffix", "totali");
  renderMissionList(ui.locationMissionList, recommendedLocations);

  ui.personalPanelTitle.textContent = MISSION_HOME_CONTENT.sections?.personal?.title || "Missioni profilo";
  ui.personalPanelText.textContent = MISSION_HOME_CONTENT.sections?.personal?.text || "";
  ui.personalSectionCount.textContent = formatLabeledCount(personalMissions.length, "counts.totalsSuffix", "totali");
  renderMissionList(ui.personalMissionList, recommendedPersonal);
}

function renderCategoryDetail() {
  const categoryId = getCurrentCategoryId();
  const section = getSectionConfig(activeDetailSection);
  const missions = getSectionContent(activeDetailSection, categoryId);
  const filteredMissions = filterMissions(missions, activeDetailFilters);

  ui.detailTitle.textContent = section.detailTitle || section.title || "Archivio missioni";
  ui.detailText.textContent = section.text || "";
  ui.detailFilterTitle.textContent = MISSION_HOME_CONTENT.detailView?.filterTitle || "Filtra le missioni";
  ui.detailCategoryCount.textContent = formatLabeledCount(missions.length, "counts.missionsSuffix", "missioni");
  ui.detailResultsCount.textContent = formatLabeledCount(filteredMissions.length, "counts.resultsSuffix", "risultati");
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
  activeDetailFilters = createDefaultDetailFilters();
  renderCategoryDetail();
  setScene("categoryDetail");
}

function openMissionDetail(missionId) {
  const mission = getMissionById(missionId);
  if (!mission) {
    return;
  }

  activeMissionId = missionId;
  missionDetailBackScene = currentScene === "categoryDetail" ? "categoryDetail" : "home";
  renderMissionDetail(mission);
  setScene("missionDetail");
}

function closeMissionDetail() {
  activeMissionId = null;

  if (missionDetailBackScene === "categoryDetail") {
    renderCategoryDetail();
    setScene("categoryDetail");
    return;
  }

  showHome();
}

function toggleActiveMissionSaved() {
  if (!activeMissionId) {
    return;
  }

  toggleMissionStateValue("savedMissionIds", activeMissionId);
  const mission = getMissionById(activeMissionId);
  if (mission) {
    renderMissionDetail(mission);
  }
}

function toggleActiveMissionCompleted() {
  if (!activeMissionId) {
    return;
  }

  toggleMissionStateValue("completedMissionIds", activeMissionId);
  const mission = getMissionById(activeMissionId);
  if (mission) {
    renderMissionDetail(mission);
  }
}

function openNextMission() {
  const mission = activeMissionId ? getMissionById(activeMissionId) : null;
  const nextMissionId = mission?.sequence?.nextMissionId;
  if (!nextMissionId) {
    return;
  }

  openMissionDetail(nextMissionId);
}

function showHome() {
  if (!isHomeUnlocked()) {
    setScene("entry");
    return;
  }

  resolvedCategoryId = resolvedCategoryId || getCurrentCategoryId();
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
  activeDetailFilters = createDefaultDetailFilters();
  activeMissionId = null;
  missionDetailBackScene = "home";
  categoryScores = {};
  categoryTrail = [];
  activeAnswerButton = null;
  ui.feedbackOverlay.hidden = true;
}

function showMission() {
  resetQuizState();
  ui.missionTitle.textContent = QUIZ_CONTENT.introTitle || "Missione 0";
  ui.missionIntro.textContent = QUIZ_CONTENT.introText || "";
  ui.tapHint.textContent = QUIZ_CONTENT.tapToContinueLabel || getUiText("quiz.tapHint", "Tocca per continuare");
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
ui.missionDetailBackButton.addEventListener("click", closeMissionDetail);
ui.missionSaveButton.addEventListener("click", toggleActiveMissionSaved);
ui.missionCompleteButton.addEventListener("click", toggleActiveMissionCompleted);
ui.missionNextButton.addEventListener("click", openNextMission);
ui.detailSearchInput.addEventListener("input", () => {
  activeDetailFilters = {
    ...activeDetailFilters,
    search: ui.detailSearchInput.value
  };
  renderCategoryDetail();
});
ui.detailSearchClear.addEventListener("click", () => {
  activeDetailFilters = createDefaultDetailFilters();
  renderCategoryDetail();
});

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
  applyStaticText();
  renderStorySlide();
  syncSceneWithHash();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
