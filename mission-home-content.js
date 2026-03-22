window.MISSION_HOME_CONTENT = {
  statusLabel: "Archivio missioni attivo",
  hero: {
    kicker: "Home missioni",
    title: "La tua plancia di gioco a Istanbul",
    text: "Qui trovi le missioni generali, quelle legate ai luoghi e quelle sbloccate dal profilo emerso nel quiz. Tutto il contenuto di questa home e personalizzabile da questo file."
  },
  profileCard: {
    kicker: "Profilo emerso",
    fallbackTitle: "Profilo in attesa",
    fallbackText: "Completa Missione 0 per sbloccare la categoria personale e le missioni su misura."
  },
  overview: {
    kicker: "Mappa operativa",
    title: "Trova subito dove entrare",
    text: "Qui vedi solo una selezione raccomandata. Ogni famiglia di missioni ha poi una schermata dedicata, utile per esplorare l'archivio completo con filtri.",
    stats: {
      totalLabel: "Missioni raccomandate",
      generalLabel: "Generali",
      locationLabel: "Luoghi",
      personalLabel: "Profilo"
    }
  },
  navigation: {
    title: "Apri un archivio missioni"
  },
  detailView: {
    backLabel: "Torna alla home",
    filterTitle: "Filtra le missioni",
    emptyTitle: "Nessuna missione con questi filtri",
    emptyText: "Prova a cambiare combinazione per far riapparire altre missioni."
  },
  sections: {
    general: {
      anchorLabel: "Generali",
      kicker: "Missioni generali",
      title: "Azioni che puoi fare ovunque",
      text: "Sfide leggere da attivare in qualsiasi momento del viaggio.",
      detailTitle: "Archivio missioni generali"
    },
    locations: {
      anchorLabel: "Luoghi",
      kicker: "Missioni luogo",
      title: "Missioni legate a spazi precisi",
      text: "Obiettivi che si accendono quando raggiungi un luogo simbolico.",
      detailTitle: "Archivio missioni legate ai luoghi"
    },
    personal: {
      anchorLabel: "Profilo",
      kicker: "Missioni del profilo",
      title: "Missioni calibrate sulla tua categoria",
      text: "Il quiz ha individuato un modo personale di attraversare la citta. Qui trovi le missioni coerenti con quel taglio.",
      detailTitle: "Archivio missioni del profilo"
    }
  },
  categories: {
    a: {
      title: "Custode del tempo",
      shortLabel: "Storico",
      description: "Cerchi contesto, stratificazioni, passaggi di epoca e segni del potere.",
      iconSrc: "./assets/theme/icon-complete-default.svg",
      iconAlt: "Icona categoria Custode del tempo"
    },
    c: {
      title: "Cercatore di storie",
      shortLabel: "Narrativo",
      description: "Segui leggende, dettagli strani, superstizioni e racconti che cambiano forma.",
      iconSrc: "./assets/theme/icon-story-default.svg",
      iconAlt: "Icona categoria Cercatore di storie"
    },
    d: {
      title: "Rabdomante del dettaglio",
      shortLabel: "Dettaglio",
      description: "Noti texture, simboli, gesti, materiali e piccole anomalie che gli altri ignorano.",
      iconSrc: "./assets/theme/icon-mission-default.svg",
      iconAlt: "Icona categoria Rabdomante del dettaglio"
    },
    e: {
      title: "Esploratore di traiettorie",
      shortLabel: "Percorso",
      description: "Ti guidano deviazioni, passaggi laterali, prospettive e connessioni tra quartieri.",
      iconSrc: "./assets/theme/icon-seal-default.svg",
      iconAlt: "Icona categoria Esploratore di traiettorie"
    },
    cu: {
      title: "Cartografo umano",
      shortLabel: "Relazionale",
      description: "Leggi la citta attraverso persone, voci, sguardi e piccoli scambi sociali.",
      iconSrc: "./assets/theme/icon-story-default.svg",
      iconAlt: "Icona categoria Cartografo umano"
    }
  },
  missions: {
    general: [
      {
        title: "Tre segnali in 10 minuti",
        description: "Raccogli tre dettagli che cambiano il modo in cui percepisci la strada in cui ti trovi.",
        meta: "Anywhere / 10 min",
        recommended: true,
        filters: ["breve", "osservazione", "ovunque"],
        iconSrc: "./assets/theme/icon-mission-default.svg",
        iconAlt: "Icona missione generale"
      },
      {
        title: "Audio invisibile",
        description: "Fermati per un minuto e annota tre suoni che definiscono il luogo piu di qualsiasi foto.",
        meta: "Osservazione",
        recommended: true,
        filters: ["breve", "ascolto", "ovunque"],
        iconSrc: "./assets/theme/icon-story-default.svg",
        iconAlt: "Icona missione generale"
      },
      {
        title: "Cartolina futura",
        description: "Scegli un punto qualsiasi della citta e descrivilo come se dovessi consigliarlo a qualcuno tra dieci anni.",
        meta: "Anywhere / scrittura",
        filters: ["riflessione", "ovunque"],
        iconSrc: "./assets/theme/icon-complete-default.svg",
        iconAlt: "Icona missione generale"
      }
    ],
    locations: [
      {
        title: "Bosforo: scegli una soglia",
        description: "Sul traghetto o sulla riva, individua il punto in cui la citta sembra cambiare identita.",
        meta: "Luogo / Bosforo",
        recommended: true,
        filters: ["bosforo", "movimento", "luogo"],
        iconSrc: "./assets/theme/icon-seal-default.svg",
        iconAlt: "Icona missione luogo"
      },
      {
        title: "Grand Bazar: mappa una deviazione",
        description: "Entra in un corridoio secondario e registra cosa cambia rispetto alla rotta principale.",
        meta: "Luogo / Grand Bazar",
        recommended: true,
        filters: ["grand-bazar", "mappatura", "luogo"],
        iconSrc: "./assets/theme/icon-mission-default.svg",
        iconAlt: "Icona missione luogo"
      },
      {
        title: "Cisterna Basilica: cerca il fuori tono",
        description: "Trova un elemento che sembra appartenere a un'altra epoca o a un'altra storia.",
        meta: "Luogo / Cisterna",
        filters: ["cisterna", "osservazione", "luogo"],
        iconSrc: "./assets/theme/icon-complete-default.svg",
        iconAlt: "Icona missione luogo"
      },
      {
        title: "Moschea Blu: leggi il ritmo",
        description: "Resta fermo per qualche minuto e osserva come il luogo cambia con i flussi di ingresso, uscita e sosta.",
        meta: "Luogo / Moschea Blu",
        filters: ["moschea-blu", "ritmo", "luogo"],
        iconSrc: "./assets/theme/icon-story-default.svg",
        iconAlt: "Icona missione luogo"
      }
    ],
    byCategory: {
      a: [
        {
          title: "Ricostruisci una linea del tempo",
          description: "Scegli un luogo e annota tre epoche che, in modi diversi, lo attraversano ancora oggi.",
          meta: "Profilo / Storico",
          recommended: true,
          filters: ["storico", "stratificazione", "profilo"],
          iconSrc: "./assets/theme/icon-complete-default.svg",
          iconAlt: "Icona missione profilo"
        },
        {
          title: "Caccia al riuso",
          description: "Individua un frammento architettonico o simbolico riutilizzato in un contesto nuovo.",
          meta: "Profilo / Storico",
          filters: ["storico", "architettura", "profilo"],
          iconSrc: "./assets/theme/icon-seal-default.svg",
          iconAlt: "Icona missione profilo"
        }
      ],
      c: [
        {
          title: "Leggenda locale",
          description: "Trova un racconto, una superstizione o un aneddoto e trascrivilo in una frase sola.",
          meta: "Profilo / Narrativo",
          recommended: true,
          filters: ["narrativo", "leggende", "profilo"],
          iconSrc: "./assets/theme/icon-story-default.svg",
          iconAlt: "Icona missione profilo"
        },
        {
          title: "Oggetto con doppia vita",
          description: "Scegli un oggetto visto oggi e immagina la storia nascosta che potrebbe portarsi dietro.",
          meta: "Profilo / Narrativo",
          filters: ["narrativo", "immaginazione", "profilo"],
          iconSrc: "./assets/theme/icon-mission-default.svg",
          iconAlt: "Icona missione profilo"
        }
      ],
      d: [
        {
          title: "Archivio dei micro-dettagli",
          description: "Fotografa o annota tre dettagli che raccontano il luogo meglio della vista d'insieme.",
          meta: "Profilo / Dettaglio",
          recommended: true,
          filters: ["dettaglio", "osservazione", "profilo"],
          iconSrc: "./assets/theme/icon-mission-default.svg",
          iconAlt: "Icona missione profilo"
        },
        {
          title: "Pattern ricorrente",
          description: "Segui un colore, un simbolo o una texture e scopri dove riappare nella giornata.",
          meta: "Profilo / Dettaglio",
          filters: ["dettaglio", "pattern", "profilo"],
          iconSrc: "./assets/theme/icon-complete-default.svg",
          iconAlt: "Icona missione profilo"
        }
      ],
      e: [
        {
          title: "Deviazione utile",
          description: "Abbandona il percorso piu ovvio e trova una scorciatoia che cambi il ritmo dell'esplorazione.",
          meta: "Profilo / Percorso",
          recommended: true,
          filters: ["percorso", "movimento", "profilo"],
          iconSrc: "./assets/theme/icon-seal-default.svg",
          iconAlt: "Icona missione profilo"
        },
        {
          title: "Nodo di passaggio",
          description: "Identifica un punto dove flussi, direzioni e intenzioni diverse si incrociano.",
          meta: "Profilo / Percorso",
          filters: ["percorso", "mappatura", "profilo"],
          iconSrc: "./assets/theme/icon-mission-default.svg",
          iconAlt: "Icona missione profilo"
        }
      ],
      cu: [
        {
          title: "Una frase da conservare",
          description: "Porta via una micro-conversazione, un saluto o una frase che valga come souvenir umano.",
          meta: "Profilo / Relazionale",
          recommended: true,
          filters: ["relazionale", "persone", "profilo"],
          iconSrc: "./assets/theme/icon-story-default.svg",
          iconAlt: "Icona missione profilo"
        },
        {
          title: "Geografia delle persone",
          description: "Osserva come cambia l'energia di un luogo quando cambiano i gruppi che lo attraversano.",
          meta: "Profilo / Relazionale",
          filters: ["relazionale", "osservazione", "profilo"],
          iconSrc: "./assets/theme/icon-seal-default.svg",
          iconAlt: "Icona missione profilo"
        }
      ]
    }
  }
};
