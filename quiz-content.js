window.QUIZ_CONTENT = {
  introTitle: "Missione 0",
  introText: "Scegli ogni risposta d'istinto. Alcune scelte apriranno un indizio prima della domanda successiva.",
  tapToContinueLabel: "Tocca per continuare",
  startQuestionId: "q1",
  completion: {
    title: "Percorso avviato",
    text: "La tua tribù sta prendendo forma. Da qui in poi il viaggio potrà seguire strade diverse in base alle tue scelte."
  },
  questions: [
    {
      id: "q1",
      text: "Istanbul ti accoglie con una strada sconosciuta. Cosa segui per prima cosa?",
      answers: [
        {
          label: "Una porta socchiusa",
          nextId: "q2_porta",
          feedback: "Ogni porta a Istanbul sembra privata, ma spesso custodisce un cortile che cambia il ritmo della città."
        },
        {
          label: "Un profumo di spezie",
          nextId: "q2_spezie"
        },
        {
          label: "Un suono lontano",
          nextId: "q2_suono",
          feedback: "I suoni qui non indicano solo una direzione: raccontano anche chi sta vivendo quel quartiere."
        }
      ]
    },
    {
      id: "q2_porta",
      text: "Dietro la porta trovi un cortile silenzioso. Cosa fai?",
      description: "A Istanbul i cortili interni cambiano improvvisamente il ritmo: fuori c'e' il flusso della strada, dentro resta solo un'eco lontana.",
      answers: [
        {
          label: "Mi fermo a osservare",
          nextId: "q3_osserva"
        },
        {
          label: "Cerco un dettaglio nascosto",
          nextId: "q3_dettaglio",
          feedback: "Chi cerca dettagli raramente attraversa la città in linea retta."
        }
      ]
    },
    {
      id: "q2_spezie",
      text: "Il profumo ti porta in un vicolo pieno di bancarelle. Cosa ti colpisce di più?",
      answers: [
        {
          label: "I colori delle polveri",
          nextId: "q3_dettaglio"
        },
        {
          label: "Le voci dei venditori",
          nextId: "q3_ascolto",
          feedback: "Le città si capiscono anche da come contrattano, scherzano e insistono."
        }
      ]
    },
    {
      id: "q2_suono",
      text: "Il suono rimbalza tra i muri e cambia a ogni angolo. Come reagisci?",
      answers: [
        {
          label: "Lo seguo senza pensarci",
          nextId: "q3_ascolto"
        },
        {
          label: "Mi fermo e confronto i rumori",
          nextId: "q3_osserva"
        }
      ]
    },
    {
      id: "q3_osserva",
      text: "Quando guardi un luogo nuovo, cosa ti rivela davvero dove ti trovi?",
      answers: [
        {
          label: "La luce sulle superfici",
          nextId: "q4_finale"
        },
        {
          label: "Come si muovono le persone",
          nextId: "q4_finale",
          feedback: "Seguire i gesti degli altri e' spesso il modo piu' rapido per leggere una città."
        }
      ]
    },
    {
      id: "q3_dettaglio",
      text: "Trovi un mosaico consumato dal tempo. Qual e' il tuo primo impulso?",
      description: "Non tutto qui si mostra intero: a volte un frammento dice piu' di un monumento perfettamente conservato.",
      answers: [
        {
          label: "Immaginare la storia che porta con sé",
          nextId: "q4_finale"
        },
        {
          label: "Capire chi lo nota oltre a me",
          nextId: "q4_finale"
        }
      ]
    },
    {
      id: "q3_ascolto",
      text: "Se un quartiere avesse una colonna sonora, quale parte ascolteresti con più attenzione?",
      answers: [
        {
          label: "Le pause tra i rumori",
          nextId: "q4_finale",
          feedback: "Le pause raccontano quanto una città lascia spazio al respiro."
        },
        {
          label: "Le voci che si sovrappongono",
          nextId: "q4_finale"
        }
      ]
    },
    {
      id: "q4_finale",
      text: "Ultima scelta: nel tuo viaggio ideale vuoi sentirti più...",
      answers: [
        {
          label: "Esploratore di tracce",
          nextId: null,
          feedback: "Perfetto. Il percorso puo' iniziare costruendo una mappa fatta di dettagli, deviazioni e scoperte laterali."
        },
        {
          label: "Ascoltatore di storie",
          nextId: null,
          feedback: "Perfetto. Il percorso puo' iniziare seguendo voci, incontri e frammenti di città raccontata."
        },
        {
          label: "Cercatore di atmosfere",
          nextId: null,
          feedback: "Perfetto. Il percorso puo' iniziare inseguendo luci, ritmi e luoghi che cambiano umore."
        }
      ]
    }
  ]
};
