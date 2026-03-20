export const homeViewModel = {
  brand: {
    name: "TravelGame",
    tagline: "Viaggia. Scopri. Gioca.",
    intro:
      "Una home pensata per aprirsi con un logo immersivo e trasformarsi, con lo scroll, in una testata elegante pronta a ospitare contenuti dinamici.",
  },
  missionZero: {
    eyebrow: "Missione 0",
    title: "Pensavi di poter entrare subito nell'avventura?",
    description:
      "Prima di farlo devi dimostrare di essere pronto e scoprire a quale tribù appartieni. Bastano poche scelte: il viaggio inizierà da lì.",
    cta: "Avvia la Missione 0",
    completeCta: "Entra nell'avventura",
  },
  highlights: [
    { value: "19:9", label: "mobile ratio" },
    { value: "Sticky", label: "header flow" },
    { value: "Modular", label: "content blocks" },
  ],
  onboardingQuiz: {
    intro: {
      eyebrow: "Ingresso",
      title: "Prima di partire, raccontaci come vuoi vivere il viaggio",
      description:
        "Un passaggio rapido di onboarding per personalizzare tono, ritmo e tipo di contenuti che mostreremo nella home.",
      cta: "Inizia il quiz",
    },
    questions: [
      {
        question: "Che tipo di esperienza cerchi appena entri nell'app?",
        answers: [
          { label: "Esplorazione libera", profile: "explorer" },
          { label: "Missioni guidate", profile: "challenger" },
          { label: "Ispirazione rilassata", profile: "dreamer" },
        ],
      },
      {
        question: "Quanto vuoi che l'app sia dinamica e piena di stimoli?",
        answers: [
          { label: "Molto, voglio movimento", profile: "challenger" },
          { label: "Equilibrata e chiara", profile: "explorer" },
          { label: "Morbida e tranquilla", profile: "dreamer" },
        ],
      },
      {
        question: "Cosa ti incuriosisce di piu in una destinazione?",
        answers: [
          { label: "Luoghi da scoprire", profile: "explorer" },
          { label: "Sfide ed obiettivi", profile: "challenger" },
          { label: "Atmosfera e storie", profile: "dreamer" },
        ],
      },
    ],
    results: {
      explorer: {
        eyebrow: "Profilo",
        title: "Tribu dell'Esploratore",
        description:
          "Ti guidano curiosita e scoperta. Possiamo costruire per te una home piena di mappe, percorsi e punti d'interesse.",
      },
      challenger: {
        eyebrow: "Profilo",
        title: "Tribu del Challenger",
        description:
          "Cerchi ritmo, obiettivi e progressione. La home potra valorizzare missioni, streak, ricompense e attivita giornaliere.",
      },
      dreamer: {
        eyebrow: "Profilo",
        title: "Tribu del Dreamer",
        description:
          "Ti ispira il lato narrativo del viaggio. Possiamo dare priorita a contenuti editoriali, suggestioni e percorsi tematici.",
      },
    },
  },
  infoSections: [
    {
      eyebrow: "Panoramica",
      title: "Sezione informativa pronta a crescere",
      description:
        "Qui possiamo inserire messaggi editoriali, onboarding, contenuti dinamici o aggiornamenti che cambiano in base alla partita o alla posizione dell'utente.",
    },
    {
      eyebrow: "Live Content",
      title: "Spazio per feed, missioni o suggerimenti",
      description:
        "La struttura lascia già posto a card modulari, call to action, dati remoti e blocchi aggiornabili senza toccare l'impianto della pagina.",
    },
    {
      eyebrow: "Roadmap UI",
      title: "Base solida per la futura identità grafica",
      description:
        "Possiamo evolvere questa home con illustrazioni, animazioni, mappe, statistiche o navigazione avanzata mantenendo la stessa architettura.",
    },
  ],
  infoCards: [
    {
      title: "Novità in arrivo",
      description: "Area ideale per teaser, eventi stagionali o annunci live.",
    },
    {
      title: "Missione del giorno",
      description: "Blocco pensato per challenge, progressi e ricompense.",
    },
  ],
  navigation: [
    { label: "Home", icon: "◉", current: true },
    { label: "Mappe", icon: "⌖", current: false },
    { label: "Sfide", icon: "✦", current: false },
    { label: "Profilo", icon: "☺", current: false },
  ],
};
