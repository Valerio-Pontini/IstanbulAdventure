export const gameText = {
  cover: {
    title: "Istanbul Adventure",
  },
  welcome: {
    eyebrow: "",
    title: "Benvenuti",
    card: {
      front: [
        "Questa non e una guida: e un modo diverso di vivere la citta.",
        "Durante il viaggio non seguirete un percorso fisso: scoprirete Istanbul attraverso missioni, dettagli e storie.",
        "Ma non tutti la esplorano allo stesso modo.",
      ],
      back: [
        "A Istanbul non tutti vedono la stessa citta: ogni viaggiatore appartiene, senza saperlo, a una delle cinque tribu.",
        "Prima di iniziare, una breve missione servira a capire quale e la tua: un quiz veloce che definira il tuo modo di giocare.",
      ],
    },
    cta: "Inizia la Missione 0",
  },
  missionZero: {
    completeCta: "Entra nell'avventura",
    questions: [
      {
        question: "Qual e il primo richiamo che segui entrando in una citta sconosciuta?",
        answers: [
          { label: "Un passaggio nascosto che invita a deviare", profile: "explorer" },
          { label: "Una direzione chiara, con una sfida da completare", profile: "challenger" },
          { label: "Un dettaglio che racconta una storia antica", profile: "dreamer" },
        ],
      },
      {
        question: "Se il mercato si apre davanti a te, cosa cattura subito la tua attenzione?",
        answers: [
          { label: "Le strade laterali e quello che potrei scoprire oltre", profile: "explorer" },
          { label: "Il percorso piu efficace per arrivare al mio obiettivo", profile: "challenger" },
          { label: "Profumi, colori e voci che creano atmosfera", profile: "dreamer" },
        ],
      },
      {
        question: "Quando inizia davvero una missione perfetta per te?",
        answers: [
          { label: "Quando posso scegliere il mio itinerario", profile: "explorer" },
          { label: "Quando c'e una prova da superare subito", profile: "challenger" },
          { label: "Quando sento di essere dentro una storia", profile: "dreamer" },
        ],
      },
    ],
    results: {
      explorer: {
        eyebrow: "Profilo",
        title: "Custode delle Strade Nascoste",
        description:
          "Segui la curiosita e trovi passaggi che altri non vedono. Istanbul per te si aprira in deviazioni, mappe segrete e scoperte inattese.",
      },
      challenger: {
        eyebrow: "Profilo",
        title: "Cercatore di Prove",
        description:
          "Ti muove l'obiettivo. La citta diventera un terreno di sfide, scelte rapide e missioni da portare a termine senza esitazioni.",
      },
      dreamer: {
        eyebrow: "Profilo",
        title: "Ascoltatore di Storie",
        description:
          "Leggi la citta attraverso simboli, atmosfere e racconti. Il tuo viaggio partira dalle emozioni che Istanbul lascia sospese nell'aria.",
      },
    },
  },
};
