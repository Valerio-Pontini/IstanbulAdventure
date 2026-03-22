window.MISSION_HOME_CONTENT = {
  statusLabel: "Archivio missioni attivo",
  hero: {
    kicker: "Home missioni",
    title: "Le tue missioni a Istanbul",
    text: "Qui trovi le missioni generiche, quelle legate ai luoghi e il percorso speciale sbloccato dalla tua personalità di esplorazione."
  },
  profileCard: {
    kicker: "Personalità emersa",
    fallbackTitle: "Personalità in attesa",
    fallbackText: "Completa Missione 0 per sbloccare il tuo percorso personale."
  },
  overview: {
    kicker: "Mappa operativa",
    title: "Scegli da dove iniziare",
    text: "La home mostra una selezione consigliata. Ogni categoria ha poi un archivio dedicato con filtri rapidi.",
    stats: { totalLabel: "Missioni consigliate", generalLabel: "Generiche", locationLabel: "Luoghi", personalLabel: "Per te" }
  },
  navigation: { title: "Apri un archivio missioni" },
  detailView: {
    backLabel: "Torna alla home",
    filterTitle: "Filtra le missioni",
    emptyTitle: "Nessuna missione con questi filtri",
    emptyText: "Prova a cambiare filtro per vedere altre missioni."
  },
  sections: {
    general: { anchorLabel: "Generiche", kicker: "Missioni generiche", title: "Azioni che puoi fare quasi ovunque", text: "Missioni leggere e immediate, pensate per accompagnare il viaggio senza imporre un itinerario.", detailTitle: "Archivio missioni generiche" },
    locations: { anchorLabel: "Luoghi", kicker: "Missioni luogo", title: "Missioni legate a punti iconici", text: "Obiettivi che si accendono quando arrivi in luoghi simbolici della città.", detailTitle: "Archivio missioni per luogo" },
    personal: { anchorLabel: "Per te", kicker: "Missioni personalità", title: "Missioni calibrate sul tuo sguardo", text: "Il quiz ha individuato il tuo modo di leggere Istanbul. Qui trovi le missioni più coerenti con quella personalità.", detailTitle: "Archivio missioni personali" }
  },
  categories: {
    a: { title: "Archivisti degli Imperi", shortLabel: "Imperi", description: "Cerchi stratificazioni storiche, architetture di potere e tracce lasciate dalle epoche della città.", iconSrc: "./assets/symbols/archivisti.svg", iconAlt: "Icona Archivisti degli Imperi" },
    c: { title: "Cacciatori di Leggende", shortLabel: "Leggende", description: "Segui racconti urbani, superstizioni, misteri e dettagli che sembrano nascondere una storia.", iconSrc: "./assets/symbols/leggende.svg", iconAlt: "Icona Cacciatori di Leggende" },
    e: { title: "Esploratori della Città", shortLabel: "Città", description: "Ti guidano traiettorie, traghetti, panorami, quartieri e connessioni tra i lati di Istanbul.", iconSrc: "./assets/symbols/citta.svg", iconAlt: "Icona Esploratori della Città" },
    cu: { title: "Custodi delle Tradizioni", shortLabel: "Tradizioni", description: "Leggi Istanbul attraverso çay, cibo, rituali sociali, mercati e abitudini quotidiane.", iconSrc: "./assets/symbols/tradizioni.svg", iconAlt: "Icona Custodi delle Tradizioni" },
    d: { title: "Decifratori dei Simboli", shortLabel: "Simboli", description: "Noti nazar, tulipani, mosaici, pattern e piccoli segni che quasi tutti ignorano.", iconSrc: "./assets/symbols/simboli.svg", iconAlt: "Icona Decifratori dei Simboli" }
  },
  missions: {
    general: [
      { title: "Tre segnali in 10 minuti", description: "Raccogli tre dettagli che cambiano il modo in cui percepisci la strada in cui ti trovi.", meta: "Ovunque / 10 min", recommended: true, filters: ["breve", "osservazione", "ovunque"], iconSrc: "./assets/symbols/generic.svg", iconAlt: "Icona missione generica" },
      { title: "Audio invisibile", description: "Fermati un minuto e annota tre suoni che definiscono il luogo più di qualsiasi foto.", meta: "Ovunque / ascolto", recommended: true, filters: ["breve", "ascolto", "ovunque"], iconSrc: "./assets/symbols/generic.svg", iconAlt: "Icona missione generica" },
      { title: "Cartolina futura", description: "Scegli un punto della città e descrivilo come se dovessi consigliarlo a qualcuno tra dieci anni.", meta: "Ovunque / scrittura", filters: ["riflessione", "ovunque"], iconSrc: "./assets/symbols/generic.svg", iconAlt: "Icona missione generica" }
    ],
    locations: [
      { title: "Bosforo: scegli una soglia", description: "Sul traghetto o sulla riva, individua il punto in cui la città sembra cambiare identità.", meta: "Bosforo", recommended: true, filters: ["bosforo", "movimento", "luogo"], iconSrc: "./assets/symbols/luoghi.svg", iconAlt: "Icona missione luogo" },
      { title: "Grand Bazaar: mappa una deviazione", description: "Entra in un corridoio secondario e registra cosa cambia rispetto alla rotta principale.", meta: "Grand Bazaar", recommended: true, filters: ["bazaar", "mappatura", "luogo"], iconSrc: "./assets/symbols/luoghi.svg", iconAlt: "Icona missione luogo" },
      { title: "Cisterna Basilica: cerca il fuori tono", description: "Trova un elemento che sembra appartenere a un'altra epoca o a un'altra storia.", meta: "Cisterna Basilica", filters: ["cisterna", "osservazione", "luogo"], iconSrc: "./assets/symbols/luoghi.svg", iconAlt: "Icona missione luogo" },
      { title: "Moschea Blu: leggi il ritmo", description: "Resta fermo qualche minuto e osserva come il luogo cambia con ingressi, uscite e soste.", meta: "Moschea Blu", filters: ["moschea", "ritmo", "luogo"], iconSrc: "./assets/symbols/luoghi.svg", iconAlt: "Icona missione luogo" }
    ],
    byCategory: {
      a: [
        { title: "Ricostruisci una linea del tempo", description: "Scegli un luogo e annota tre epoche che, in modi diversi, lo attraversano ancora oggi.", meta: "Archivisti degli Imperi", recommended: true, filters: ["storia", "stratificazione", "profilo"], iconSrc: "./assets/symbols/archivisti.svg", iconAlt: "Icona missione Archivisti" },
        { title: "Caccia al riuso", description: "Individua un frammento architettonico o simbolico riutilizzato in un contesto nuovo.", meta: "Archivisti degli Imperi", filters: ["architettura", "riuso", "profilo"], iconSrc: "./assets/symbols/archivisti.svg", iconAlt: "Icona missione Archivisti" }
      ],
      c: [
        { title: "Leggenda locale", description: "Trova un racconto, una superstizione o un aneddoto e trascrivilo in una frase sola.", meta: "Cacciatori di Leggende", recommended: true, filters: ["leggende", "racconto", "profilo"], iconSrc: "./assets/symbols/leggende.svg", iconAlt: "Icona missione Leggende" },
        { title: "Oggetto con doppia vita", description: "Scegli un oggetto visto oggi e immagina la storia nascosta che potrebbe portarsi dietro.", meta: "Cacciatori di Leggende", filters: ["immaginazione", "mistero", "profilo"], iconSrc: "./assets/symbols/leggende.svg", iconAlt: "Icona missione Leggende" }
      ],
      e: [
        { title: "Deviazione utile", description: "Abbandona il percorso più ovvio e trova una scorciatoia che cambi il ritmo dell'esplorazione.", meta: "Esploratori della Città", recommended: true, filters: ["percorso", "movimento", "profilo"], iconSrc: "./assets/symbols/citta.svg", iconAlt: "Icona missione Città" },
        { title: "Nodo di passaggio", description: "Identifica un punto dove flussi, direzioni e intenzioni diverse si incrociano.", meta: "Esploratori della Città", filters: ["mappa", "quartieri", "profilo"], iconSrc: "./assets/symbols/citta.svg", iconAlt: "Icona missione Città" }
      ],
      cu: [
        { title: "Una frase da conservare", description: "Porta via una micro-conversazione, un saluto o una frase che valga come souvenir umano.", meta: "Custodi delle Tradizioni", recommended: true, filters: ["persone", "rituali", "profilo"], iconSrc: "./assets/symbols/tradizioni.svg", iconAlt: "Icona missione Tradizioni" },
        { title: "Geografia delle persone", description: "Osserva come cambia l'energia di un luogo quando cambiano i gruppi che lo attraversano.", meta: "Custodi delle Tradizioni", filters: ["sociale", "osservazione", "profilo"], iconSrc: "./assets/symbols/tradizioni.svg", iconAlt: "Icona missione Tradizioni" }
      ],
      d: [
        { title: "Archivio dei micro-dettagli", description: "Fotografa o annota tre dettagli che raccontano il luogo meglio della vista d'insieme.", meta: "Decifratori dei Simboli", recommended: true, filters: ["dettaglio", "simboli", "profilo"], iconSrc: "./assets/symbols/simboli.svg", iconAlt: "Icona missione Simboli" },
        { title: "Pattern ricorrente", description: "Segui un colore, un simbolo o una texture e scopri dove riappare nella giornata.", meta: "Decifratori dei Simboli", filters: ["pattern", "mosaici", "profilo"], iconSrc: "./assets/symbols/simboli.svg", iconAlt: "Icona missione Simboli" }
      ]
    }
  }
};
