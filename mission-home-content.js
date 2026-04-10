(() => {
  const homeContent = window.APP_TEXT?.it?.content?.home ?? {};
  const categories = homeContent.categories ?? {};
  const rawMissions = window.MISSIONI_V3_BACKEND?.missioni ?? [];
  const categoryIds = Object.keys(categories);

  const personaAliases = new Map([
    ["archivisti degli imperi", ["a"]],
    ["cacciatori di leggende", ["c"]],
    ["esploratori della citta", ["e"]],
    ["custodi delle tradizioni", ["cu"]],
    ["decifratori di simboli", ["d"]],
    ["decifratori dei simboli", ["d"]],
    ["archivisti ed esploratori", ["a", "e"]]
  ]);

  const detailCopy = {
    tagsLabel: "Temi e tag",
    objectiveTitle: "La missione",
    flowTitle: "Come si completa",
    flowSingle: "passaggi",
    infoTitle: "Approfondimento",
    sequenceTitle: "Sequenza",
    summaryLocation: "Luogo",
    summaryType: "Tipologia",
    summaryDifficulty: "Difficoltà",
    summaryDuration: "Durata",
    summaryBudget: "Budget",
    summaryPoints: "Punteggio",
    saveLabel: "Salva",
    savedLabel: "Salvata",
    completeLabel: "Segna come fatta",
    completedLabel: "Completata",
    nextLabel: "Missione successiva",
    noNextLabel: "Fine sequenza"
  };

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function slugify(value) {
    return normalizeText(value)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function titleCase(value) {
    if (!value) {
      return "";
    }

    const normalized = String(value).replace(/-/g, " ");
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  function resolvePersonaCategoryIds(values = []) {
    const resolvedIds = values.flatMap((value) => personaAliases.get(normalizeText(value)) ?? []);
    return Array.from(new Set(resolvedIds)).filter((categoryId) => categories[categoryId]);
  }

  function buildAudience(values = []) {
    if (!values.length || values.includes("tutti")) {
      return { mode: "all", categoryIds: [], label: "Per tutti" };
    }

    if (values[0] === "tutti_tranne") {
      const categoryIds = resolvePersonaCategoryIds(values.slice(1));
      const titles = categoryIds.map((categoryId) => categories[categoryId]?.shortLabel || categories[categoryId]?.title).filter(Boolean);
      return {
        mode: "exclude",
        categoryIds,
        label: titles.length ? `Tutti tranne ${titles.join(", ")}` : "Tutti tranne alcune personalità"
      };
    }

    const categoryIds = resolvePersonaCategoryIds(values);
    const titles = categoryIds.map((categoryId) => categories[categoryId]?.shortLabel || categories[categoryId]?.title).filter(Boolean);
    return {
      mode: "include",
      categoryIds,
      label: titles.length ? `Per ${titles.join(", ")}` : "Per una personalità specifica"
    };
  }

  function getAvailableCategoryIds(audience) {
    if (audience.mode === "all") {
      return categoryIds;
    }

    if (audience.mode === "exclude") {
      return categoryIds.filter((categoryId) => !audience.categoryIds.includes(categoryId));
    }

    return audience.categoryIds;
  }

  function formatDifficultyLabel(level) {
    if (level <= 2) {
      return `Facile ${level}/5`;
    }

    if (level === 3) {
      return "Media 3/5";
    }

    return `Difficile ${level}/5`;
  }

  function getBudgetBucket(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      return "free";
    }

    if (amount <= 150) {
      return "low";
    }

    if (amount <= 350) {
      return "medium";
    }

    return "high";
  }

  function formatBudgetLabel(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      return "Gratis";
    }

    return `~${amount} TRY`;
  }

  function getDurationBucket(minutes) {
    if (!Number.isFinite(minutes) || minutes <= 10) {
      return "short";
    }

    if (minutes <= 20) {
      return "medium";
    }

    return "long";
  }

  function formatDurationLabel(minutes) {
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return "Durata libera";
    }

    return `${minutes} min`;
  }

  function getMissionIcon(rawMission, audience, sectionKey) {
    if (sectionKey === "locations") {
      return {
        iconSrc: "./assets/symbols/luoghi.svg",
        iconAlt: "Icona missione luogo"
      };
    }

    if (audience.mode === "include" && audience.categoryIds.length === 1) {
      const category = categories[audience.categoryIds[0]];
      if (category?.iconSrc) {
        return {
          iconSrc: category.iconSrc,
          iconAlt: category.iconAlt || `Icona ${category.title || "missione"}`
        };
      }
    }

    return {
      iconSrc: "./assets/symbols/generic.svg",
      iconAlt: "Icona missione"
    };
  }

  function buildSequence(rawMission) {
    const sequenceBackend = rawMission.backend?.sequenza ?? {};
    const name = sequenceBackend.nome || rawMission.nome_sequenza || null;
    const nextMissionId = rawMission.successiva || null;
    const isSequential = Boolean(name);

    if (!isSequential) {
      return {
        isSequential: false,
        isStandalone: true,
        name: null,
        nextMissionId: null,
        hasPrevious: false,
        hasNext: false,
        isStart: false,
        isEnd: false,
        statusLabel: "Missione standalone"
      };
    }

    const isStart = Boolean(sequenceBackend.is_inizio) || (!sequenceBackend.ha_precedente && Boolean(nextMissionId));
    const isEnd = Boolean(sequenceBackend.is_fine) || (!nextMissionId && Boolean(sequenceBackend.ha_precedente));

    return {
      isSequential: true,
      isStandalone: false,
      name,
      nextMissionId,
      hasPrevious: Boolean(sequenceBackend.ha_precedente),
      hasNext: Boolean(sequenceBackend.ha_successiva || nextMissionId),
      isStart,
      isEnd,
      statusLabel: isStart ? "Inizio sequenza" : isEnd ? "Chiusura sequenza" : "Tappa intermedia"
    };
  }

  function buildMission(rawMission) {
    const audience = buildAudience(rawMission.persona_target_backend);
    const sectionKey = rawMission.backend?.filtri?.richiede_luogo_specifico ? "locations" : "general";
    const availableForCategoryIds = getAvailableCategoryIds(audience);
    const highlightForCategoryIds = audience.mode === "all" ? [] : availableForCategoryIds;
    const sequence = buildSequence(rawMission);
    const icon = getMissionIcon(rawMission, audience, sectionKey);
    const locationLabel = rawMission.luogo === "ovunque" ? "Ovunque" : rawMission.luogo;
    const typeLabel = titleCase(rawMission.tipologia);
    const difficultyLabel = formatDifficultyLabel(rawMission.difficolta);
    const budgetLabel = formatBudgetLabel(rawMission.budget_stimato_try);
    const durationLabel = formatDurationLabel(rawMission.durata_stimata_min);
    const validationCriteria = rawMission.backend?.validazione?.criteri ?? [];

    return {
      id: rawMission.id,
      slug: rawMission.slug,
      title: rawMission.nome,
      description: rawMission.descrizione,
      locationLabel,
      typeLabel,
      groupText: rawMission.gruppo,
      discovery: rawMission.scoperta,
      information: rawMission.informazioni,
      completionMode: rawMission.mod_completamento,
      completionLabel: titleCase(rawMission.mod_completamento),
      theme: rawMission.tema_principale,
      themeLabel: titleCase(rawMission.tema_principale),
      secondaryThemes: rawMission.temi_secondari ?? [],
      secondaryThemeLabels: (rawMission.temi_secondari ?? []).map(titleCase),
      keywords: rawMission.keywords ?? [],
      difficulty: rawMission.difficolta,
      difficultyLabel,
      points: rawMission.punteggio,
      durationMin: rawMission.durata_stimata_min,
      durationLabel,
      budgetTry: rawMission.budget_stimato_try,
      budgetLabel,
      sectionKey,
      audience,
      availableForCategoryIds,
      highlightForCategoryIds,
      isPersonalized: audience.mode !== "all",
      sequence,
      validationType: rawMission.backend?.validazione?.tipo || null,
      validationCriteria,
      sortPriority: rawMission.backend?.priorita_sort ?? 999,
      filterValues: {
        place: slugify(locationLabel),
        type: slugify(rawMission.tipologia),
        theme: slugify(rawMission.tema_principale),
        difficulty: String(rawMission.difficolta),
        budget: getBudgetBucket(rawMission.budget_stimato_try),
        duration: getDurationBucket(rawMission.durata_stimata_min)
      },
      filterLabels: {
        place: locationLabel,
        type: typeLabel,
        theme: titleCase(rawMission.tema_principale),
        difficulty: difficultyLabel,
        budget: budgetLabel,
        duration: durationLabel
      },
      searchIndex: normalizeText(
        [
          rawMission.nome,
          rawMission.descrizione,
          rawMission.tema_principale,
          ...(rawMission.temi_secondari ?? []),
          ...(rawMission.keywords ?? [])
        ].join(" ")
      ),
      meta: `${locationLabel} • ${typeLabel}`,
      iconSrc: icon.iconSrc,
      iconAlt: icon.iconAlt
    };
  }

  function sortMissionList(missions) {
    return [...missions].sort((left, right) => {
      if (left.sortPriority !== right.sortPriority) {
        return left.sortPriority - right.sortPriority;
      }

      if (left.difficulty !== right.difficulty) {
        return left.difficulty - right.difficulty;
      }

      return left.title.localeCompare(right.title, "it");
    });
  }

  function isPersonalArchiveMissionForCategory(mission, categoryId) {
    return (
      mission.audience?.mode === "include" &&
      mission.audience.categoryIds.length === 1 &&
      mission.audience.categoryIds[0] === categoryId
    );
  }

  const missionIndex = Object.fromEntries(rawMissions.map((mission) => {
    const builtMission = buildMission(mission);
    return [builtMission.id, builtMission];
  }));

  const missionList = sortMissionList(Object.values(missionIndex));
  const generalMissions = missionList.filter((mission) => mission.sectionKey === "general");
  const locationMissions = missionList.filter((mission) => mission.sectionKey === "locations");
  const personalizedByCategory = Object.fromEntries(
    categoryIds.map((categoryId) => [
      categoryId,
      sortMissionList(
        missionList.filter((mission) => isPersonalArchiveMissionForCategory(mission, categoryId))
      )
    ])
  );

  window.MISSION_HOME_CONTENT = {
    ...homeContent,
    statusLabel: homeContent.statusLabel || "Archivio missioni",
    detailView: {
      ...(homeContent.detailView ?? {}),
      filterTitle: "Trova la missione giusta",
      emptyTitle: "Nessuna missione",
      emptyText: "Prova a cambiare un filtro o a cercare con un termine diverso."
    },
    missionDetail: {
      ...(homeContent.missionDetail ?? {}),
      ...detailCopy
    },
    missionIndex,
    missions: {
      all: missionList,
      general: generalMissions,
      locations: locationMissions,
      byCategory: personalizedByCategory
    }
  };
})();
