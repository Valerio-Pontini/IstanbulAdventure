(() => {
  const homeContent = window.APP_TEXT?.it?.content?.home ?? {};
  const catalog = homeContent.missions?.catalog ?? {};
  const sections = homeContent.missions?.sections ?? {};
  const categories = homeContent.categories ?? {};

  function resolveMissionList(missionIds, missionIndex) {
    return (missionIds || []).map((missionId) => missionIndex[missionId]).filter(Boolean);
  }

  function createCompletion(type, overrides = {}) {
    const defaults = {
      code: {
        label: "Codice o password",
        inputLabel: "Inserimento richiesto",
        hint: "Sblocca lo step inserendo un codice ricevuto sul posto o una password narrativa."
      },
      photo: {
        label: "Foto",
        inputLabel: "Prova fotografica",
        hint: "Lo step si chiude dopo aver caricato una foto che documenta il dettaglio richiesto."
      }
    };

    return {
      type,
      ...(defaults[type] ?? {}),
      ...overrides
    };
  }

  function buildAudienceLabel(audience) {
    if (audience.mode === "all") {
      return "Per tutti";
    }

    const titles = (audience.categoryIds || []).map((categoryId) => categories[categoryId]?.shortLabel || categories[categoryId]?.title).filter(Boolean);
    return titles.length ? `Per ${titles.join(", ")}` : "Per personalita specifiche";
  }

  function buildMissionDefinition(id, blueprint) {
    const baseMission = catalog[id];
    if (!baseMission) {
      return null;
    }

    const steps = (blueprint.steps || []).map((step, index) => ({
      id: step.id || `${id}_step_${index + 1}`,
      order: index + 1,
      title: step.title || `Step ${index + 1}`,
      description: step.description || "",
      completion: createCompletion(step.completion?.type || "code", step.completion)
    }));
    const audience = blueprint.audience || { mode: "all", categoryIds: [] };
    const completionTypes = Array.from(new Set(steps.map((step) => step.completion.type)));
    const typeLabel = blueprint.type === "place" ? "Missione luogo" : "Missione generica";
    const formatLabel = blueprint.format === "narrative" ? "Narrativa" : "Singola";
    const placeLabel = blueprint.place?.name ? blueprint.place.name : "Ovunque";
    const audienceLabel = buildAudienceLabel(audience);
    const summary = [
      typeLabel,
      audienceLabel,
      formatLabel,
      placeLabel,
      steps.length > 1 ? `${steps.length} step` : "1 step"
    ];

    return {
      id,
      ...baseMission,
      type: blueprint.type || "generic",
      typeLabel,
      format: blueprint.format || "single",
      formatLabel,
      audience,
      audienceLabel,
      place: blueprint.place || null,
      intro: blueprint.intro || baseMission.description || "",
      objectives: blueprint.objectives || [],
      steps,
      summary,
      completionTypes,
      filters: Array.from(
        new Set([
          ...(baseMission.filters || []),
          blueprint.type === "place" ? "missione luogo" : "missione generica",
          audience.mode === "all" ? "per tutti" : "per personalita",
          blueprint.format === "narrative" ? "narrativa" : "singola",
          ...completionTypes.map((type) => (type === "photo" ? "foto" : "codice"))
        ])
      )
    };
  }

  const missionBlueprints = {
    general_tre_segnali_in_10_minuti: {
      type: "generic",
      format: "single",
      audience: { mode: "all", categoryIds: [] },
      intro: "Una missione rapida per rompere l'automatismo e trasformare una strada qualsiasi in un piccolo archivio di segnali.",
      objectives: [
        "Individua tre dettagli che fanno cambiare tono alla strada.",
        "Salva la prova finale con una password ricevuta da un facilitatore o trovata nell'esperienza."
      ],
      steps: [
        {
          title: "Raccogli i tre segnali",
          description: "Osserva per dieci minuti e annota tre elementi che fanno percepire la strada in modo diverso da come l'avevi immaginata.",
          completion: {
            type: "code",
            hint: "Al termine inserisci la password della missione per confermare il completamento."
          }
        }
      ]
    },
    general_audio_invisibile: {
      type: "generic",
      format: "single",
      audience: { mode: "all", categoryIds: [] },
      intro: "Questa missione si gioca piu con l'ascolto che con lo sguardo e funziona in qualsiasi punto della citta.",
      objectives: [
        "Ascolta il luogo per almeno un minuto senza fotografarlo.",
        "Carica una foto discreta che rappresenti il paesaggio sonoro che hai percepito."
      ],
      steps: [
        {
          title: "Ascolta e documenta",
          description: "Registra mentalmente tre suoni che definiscono il luogo piu di qualsiasi immagine e poi scatta una foto che li evochi.",
          completion: {
            type: "photo",
            hint: "La foto e la prova di chiusura della missione."
          }
        }
      ]
    },
    general_cartolina_futura: {
      type: "generic",
      format: "narrative",
      audience: { mode: "all", categoryIds: [] },
      intro: "Una micro-sequenza narrativa che parte da un luogo presente e lo proietta in avanti nel tempo.",
      objectives: [
        "Scegli un punto della citta che vorresti ricordare.",
        "Supera una sequenza di tre step alternando osservazione e sblocco narrativo."
      ],
      steps: [
        {
          title: "Scegli il punto",
          description: "Fermati in un luogo che consiglieresti a qualcuno tra dieci anni e annota il perche.",
          completion: {
            type: "photo",
            hint: "Scatta una foto del luogo scelto per avviare la sequenza."
          }
        },
        {
          title: "Scrivi la cartolina",
          description: "Trasforma l'osservazione in una frase di raccomandazione futura, come se stessi scrivendo a una persona che arrivera piu avanti.",
          completion: {
            type: "code",
            hint: "Inserisci il codice di conferma per sbloccare lo step finale."
          }
        },
        {
          title: "Chiudi il messaggio",
          description: "Rileggi la frase e salva la versione definitiva della tua cartolina urbana.",
          completion: {
            type: "code",
            hint: "Una seconda password conclude la missione narrativa."
          }
        }
      ]
    },
    locations_bosforo_scegli_una_soglia: {
      type: "place",
      format: "single",
      audience: { mode: "all", categoryIds: [] },
      place: { name: "Bosforo", district: "Rive e traghetti" },
      intro: "Una missione attivata sul confine piu iconico della citta, dove Istanbul cambia continuamente prospettiva.",
      objectives: [
        "Individua il punto in cui la citta ti sembra cambiare identita.",
        "Conferma il completamento con una foto della soglia scelta."
      ],
      steps: [
        {
          title: "Trova la soglia",
          description: "Sulla riva o sul traghetto scegli il punto in cui percepisci il passaggio tra due Istanbul diverse.",
          completion: {
            type: "photo",
            hint: "La foto deve mostrare la tua soglia personale sul Bosforo."
          }
        }
      ]
    },
    locations_grand_bazaar_mappa_una_deviazione: {
      type: "place",
      format: "narrative",
      audience: { mode: "all", categoryIds: [] },
      place: { name: "Grand Bazaar", district: "Fatih" },
      intro: "Una missione concatenata che ti porta fuori dal flusso principale del bazaar per costruire una deviazione personale.",
      objectives: [
        "Lascia la rotta principale e cerca un corridoio secondario.",
        "Completa i tre step con alternanza tra prove visive e password."
      ],
      steps: [
        {
          title: "Esci dalla rotta principale",
          description: "Entra in un corridoio laterale e osserva cosa cambia rispetto all'asse piu battuto.",
          completion: {
            type: "photo",
            hint: "La prima foto certifica la deviazione."
          }
        },
        {
          title: "Disegna la tua mappa",
          description: "Segna mentalmente o su una nota due elementi che rendono unico quel passaggio secondario.",
          completion: {
            type: "code",
            hint: "Inserisci la password dello step intermedio per continuare."
          }
        },
        {
          title: "Rientra con una nuova lettura",
          description: "Torna sulla via principale e confronta il ritmo del bazaar con quello del percorso deviato.",
          completion: {
            type: "code",
            hint: "Un ultimo codice chiude la sequenza narrativa."
          }
        }
      ]
    },
    locations_cisterna_basilica_cerca_il_fuori_tono: {
      type: "place",
      format: "single",
      audience: { mode: "personality", categoryIds: ["a", "c", "d"] },
      place: { name: "Cisterna Basilica", district: "Sultanahmet" },
      intro: "Questa missione e pensata per chi coglie dissonanze, indizi o stratificazioni storiche dentro spazi molto narrativi.",
      objectives: [
        "Trova un elemento fuori tono rispetto alla scena dominante.",
        "Usa una password finale per certificare la scoperta."
      ],
      steps: [
        {
          title: "Isola il fuori tono",
          description: "Individua un dettaglio che sembra appartenere a un'altra epoca o a un'altra storia rispetto all'insieme.",
          completion: {
            type: "code",
            hint: "La missione si chiude con un codice di verifica."
          }
        }
      ]
    },
    locations_moschea_blu_leggi_il_ritmo: {
      type: "place",
      format: "single",
      audience: { mode: "all", categoryIds: [] },
      place: { name: "Moschea Blu", district: "Sultanahmet" },
      intro: "Una missione da giocare con pazienza, osservando il ritmo del luogo piu che il monumento in se.",
      objectives: [
        "Osserva come cambiano ingressi, soste e uscite.",
        "Carica una foto finale che racconti il ritmo che hai letto."
      ],
      steps: [
        {
          title: "Leggi il ritmo",
          description: "Resta fermo alcuni minuti e registra come si muovono le persone, dove rallentano e dove si aprono gli spazi.",
          completion: {
            type: "photo",
            hint: "La foto finale deve restituire il ritmo del luogo."
          }
        }
      ]
    },
    a_ricostruisci_una_linea_del_tempo: {
      type: "generic",
      format: "narrative",
      audience: { mode: "personality", categoryIds: ["a"] },
      intro: "Percorso dedicato agli Archivisti degli Imperi, costruito per leggere la citta come una stratificazione di epoche sovrapposte.",
      objectives: [
        "Scegli un luogo attraversato da piu epoche.",
        "Ricostruisci una linea del tempo in tre passaggi."
      ],
      steps: [
        {
          title: "Scegli il punto storico",
          description: "Individua un luogo in cui senti convivere almeno due tempi diversi della citta.",
          completion: {
            type: "photo",
            hint: "La foto del luogo apre il percorso personale."
          }
        },
        {
          title: "Nomina le epoche",
          description: "Associa al luogo tre epoche o fasi storiche che continuano a lasciare una traccia visibile o immaginata.",
          completion: {
            type: "code",
            hint: "Una password sblocca il terzo passaggio."
          }
        },
        {
          title: "Ricuci la continuita",
          description: "Collega le tre epoche con una breve frase che spieghi cosa resiste ancora oggi.",
          completion: {
            type: "code",
            hint: "L'ultimo codice completa la missione."
          }
        }
      ]
    },
    a_caccia_al_riuso: {
      type: "generic",
      format: "single",
      audience: { mode: "personality", categoryIds: ["a"] },
      intro: "Una missione breve per rintracciare materiali, simboli o strutture riutilizzate in nuovi contesti.",
      objectives: [
        "Trova un elemento architettonico o simbolico riusato.",
        "Documentalo con una foto come prova di completamento."
      ],
      steps: [
        {
          title: "Caccia al riuso",
          description: "Cerca un frammento che sembra avere avuto una vita precedente e ora appartiene a un contesto diverso.",
          completion: {
            type: "photo",
            hint: "La foto certifica il ritrovamento."
          }
        }
      ]
    },
    c_leggenda_locale: {
      type: "generic",
      format: "single",
      audience: { mode: "personality", categoryIds: ["c"] },
      intro: "Percorso veloce per chi colleziona racconti urbani e superstizioni.",
      objectives: [
        "Trova un aneddoto, una leggenda o una superstizione locale.",
        "Chiudi la missione con un codice dopo averla sintetizzata."
      ],
      steps: [
        {
          title: "Cattura la leggenda",
          description: "Ascolta o ricostruisci un racconto locale e riducilo a una frase essenziale.",
          completion: {
            type: "code",
            hint: "Inserisci la password finale per confermare la leggenda raccolta."
          }
        }
      ]
    },
    c_oggetto_con_doppia_vita: {
      type: "generic",
      format: "narrative",
      audience: { mode: "personality", categoryIds: ["c"] },
      intro: "Una sequenza breve in cui un oggetto quotidiano diventa il centro di una piccola storia nascosta.",
      objectives: [
        "Scegli un oggetto visto oggi.",
        "Immagina e verifica la sua doppia vita in due step concatenati."
      ],
      steps: [
        {
          title: "Scegli l'oggetto",
          description: "Seleziona un oggetto che sembra custodire una storia precedente o invisibile.",
          completion: {
            type: "photo",
            hint: "Una foto dell'oggetto apre la missione."
          }
        },
        {
          title: "Racconta la vita nascosta",
          description: "Immagina la sua storia alternativa in una frase e finalizzala con una password.",
          completion: {
            type: "code",
            hint: "Il codice finale completa il racconto."
          }
        }
      ]
    },
    e_deviazione_utile: {
      type: "generic",
      format: "single",
      audience: { mode: "personality", categoryIds: ["e"] },
      intro: "Una missione essenziale per chi esplora la citta seguendo deviazioni e connessioni.",
      objectives: [
        "Abbandona il percorso piu ovvio.",
        "Conferma con una foto la deviazione che ha cambiato il ritmo della tua giornata."
      ],
      steps: [
        {
          title: "Trova la deviazione",
          description: "Scegli una scorciatoia o una deviazione che renda il tragitto piu interessante del previsto.",
          completion: {
            type: "photo",
            hint: "La foto finale prova la tua deviazione utile."
          }
        }
      ]
    },
    e_nodo_di_passaggio: {
      type: "generic",
      format: "narrative",
      audience: { mode: "personality", categoryIds: ["e"] },
      intro: "Missione in tre passaggi per leggere Istanbul come una rete di flussi e incroci.",
      objectives: [
        "Individua un nodo di passaggio.",
        "Segui il nodo in una sequenza tra osservazione, mappa mentale e verifica."
      ],
      steps: [
        {
          title: "Trova il nodo",
          description: "Identifica un punto dove direzioni e intenzioni diverse si incrociano con evidenza.",
          completion: {
            type: "photo",
            hint: "La foto del nodo avvia la sequenza."
          }
        },
        {
          title: "Leggi i flussi",
          description: "Osserva chi arriva, chi parte e quali traiettorie prevalgono per qualche minuto.",
          completion: {
            type: "code",
            hint: "Inserisci una password per confermare la lettura."
          }
        },
        {
          title: "Ridisegna la mappa",
          description: "Riassumi il nodo come se dovessi spiegarlo a un altro viaggiatore in una riga sola.",
          completion: {
            type: "code",
            hint: "Il codice finale chiude la missione narrativa."
          }
        }
      ]
    },
    cu_una_frase_da_conservare: {
      type: "generic",
      format: "single",
      audience: { mode: "personality", categoryIds: ["cu"] },
      intro: "Una missione sociale e minima, pensata per far emergere il lato umano del viaggio.",
      objectives: [
        "Raccogli una frase, un saluto o una micro-conversazione.",
        "Conferma la raccolta con un codice finale."
      ],
      steps: [
        {
          title: "Conserva la frase",
          description: "Porta via una frase breve che valga come souvenir umano della giornata.",
          completion: {
            type: "code",
            hint: "La password finale registra la frase raccolta."
          }
        }
      ]
    },
    cu_geografia_delle_persone: {
      type: "generic",
      format: "narrative",
      audience: { mode: "personality", categoryIds: ["cu"] },
      intro: "Percorso a step per leggere come cambiano i luoghi quando cambiano le persone che li attraversano.",
      objectives: [
        "Scegli un luogo con piu gruppi sociali visibili.",
        "Completa i passaggi osservando trasformazioni e rituali."
      ],
      steps: [
        {
          title: "Scegli il punto di osservazione",
          description: "Posizionati in un luogo dove gruppi diversi transitano o si fermano con ritmi differenti.",
          completion: {
            type: "photo",
            hint: "Una foto discreta apre il percorso."
          }
        },
        {
          title: "Leggi il cambio di energia",
          description: "Osserva come il luogo cambia tono, rumore e comportamento quando mutano le persone presenti.",
          completion: {
            type: "code",
            hint: "Inserisci una password per fissare l'osservazione."
          }
        },
        {
          title: "Annota il rituale",
          description: "Chiudi con una frase che riassuma il rituale sociale che hai colto.",
          completion: {
            type: "code",
            hint: "L'ultimo codice salva la missione."
          }
        }
      ]
    },
    d_archivio_dei_micro_dettagli: {
      type: "generic",
      format: "single",
      audience: { mode: "personality", categoryIds: ["d"] },
      intro: "Missione dedicata a chi vede il luogo nei frammenti e non nell'insieme.",
      objectives: [
        "Raccogli tre micro-dettagli che raccontano il luogo.",
        "Concludi caricando una foto come prova."
      ],
      steps: [
        {
          title: "Crea l'archivio",
          description: "Fotografa o annota tre dettagli che spiegano il luogo meglio della vista d'insieme.",
          completion: {
            type: "photo",
            hint: "La foto finale o il collage fotografico chiudono la missione."
          }
        }
      ]
    },
    d_pattern_ricorrente: {
      type: "generic",
      format: "narrative",
      audience: { mode: "personality", categoryIds: ["d"] },
      intro: "Una missione a catena per seguire la ricorrenza di un segno dentro la citta.",
      objectives: [
        "Individua un simbolo, un colore o una texture ricorrente.",
        "Seguilo in una sequenza di tre passaggi."
      ],
      steps: [
        {
          title: "Trova il primo segno",
          description: "Scegli un pattern che ti colpisce e documenta la sua prima apparizione.",
          completion: {
            type: "photo",
            hint: "La foto iniziale apre la caccia al pattern."
          }
        },
        {
          title: "Segui la ricorrenza",
          description: "Cerca almeno un secondo punto in cui il pattern riappare nella giornata.",
          completion: {
            type: "code",
            hint: "Una password conferma il riconoscimento."
          }
        },
        {
          title: "Decifra il significato",
          description: "Chiudi la missione spiegando in una frase cosa racconta quel pattern della citta.",
          completion: {
            type: "code",
            hint: "Il codice finale conclude il percorso."
          }
        }
      ]
    }
  };

  const missionIndex = Object.fromEntries(
    Object.keys(catalog)
      .map((missionId) => [missionId, buildMissionDefinition(missionId, missionBlueprints[missionId] || {})])
      .filter(([, mission]) => Boolean(mission))
  );

  window.MISSION_HOME_CONTENT = {
    ...homeContent,
    missionIndex,
    missions: {
      general: resolveMissionList(sections.general, missionIndex),
      locations: resolveMissionList(sections.locations, missionIndex),
      byCategory: Object.fromEntries(
        Object.entries(sections.personalByCategory ?? {}).map(([categoryId, missionIds]) => [
          categoryId,
          resolveMissionList(missionIds, missionIndex)
        ])
      )
    }
  };
})();
