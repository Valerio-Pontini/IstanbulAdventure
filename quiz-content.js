window.QUIZ_CONTENT = {
  introTitle: "Missione 0",
  introText: "Scegli ogni risposta d'istinto. Alcune scelte apriranno un indizio prima della domanda successiva.",
  tapToContinueLabel: "Tocca per continuare",
  startQuestionId: "p1",
  completion: {
    title: "Percorso avviato",
    text: "La tua tribù sta prendendo forma. Da qui in poi il viaggio potrà seguire strade diverse in base alle tue scelte."
  },
  questions: [
    {
      id: "p1",
      text: "Sei sul Bosforo, il traghetto passa vicino a una moschea enorme",
      answers: [
        {
          label: "Pensi a quante epoche ha attraversato",
          nextId: "a_1",
          },
        {
          label: "Ti chiedi se ha storie strane legate a lei",
          nextId: "c_1"
        },
        {
          label: "Guardi il percorso dove potresti sceglere",
          nextId: "e_1"
        },
        {
          label: "Noti i dettagli della struttura e delle decorazioni",
          nextId: "d_1"
        }
      ]
    },
    {
      id: "p2",
      text: "Nel Grand Bazar un venditore ti invita a entrare",
      answers: [
        {
          label: "Inizia a parlare con lui",
          nextId: "cu_4"
        },
        {
          label: "Osservi gli oggetti esposti",
          nextId: "d_4"
        },
        {
          label: "Ti chiedi che tipo di storie avrà visto",
          nextId: "c_4"
        },
        {
          label: "Ti infili dentro per vedere dove arrivi",
          nextId: "e_4"
         }
      ]
    },
    {
      id: "p3",
      text: "Ti trovi davanti a un edificio antico senza spiegazioni",
      answers: [
        {
          label: "Ti avvicini per osservare i dettagli",
          nextId: "d_7"
        },
        {
          label: "Lo superi per trovare qualcos'altro",
          nextId: "e_7"
        },
        {
          label: "Cerchi di capire quando è stato scotruito",
          nextId: "a_7"
        },
        {
          label: "Immagini cosa potrebbe essere successo lì",
          nextId: "c_7"
        }
      ]
    },
    {
      id: "p4",
      text: "In una çay house qualcuno ti guarda e sorride",
      answers: [
        {
          label: "Ti chiedi chi sia e cosa stia pensando",
          nextId: "c_10"
        },
        {
          label: "Inizi la conversazione",
          nextId: "cu_10"
        },
        {
          label: "Noti piccoli gesti e oggetti sul tavolo",
          nextId: "d_10"
        },
        {
          label: "Ti godi la scena e vivi il momento",
          nextId: "e_10"
        }
        
      ]
    },
    {
      id: "p5",
      text: "Camminando trovi una strada che sembra poco frequentata",
      answers: [
        {
          label: "Ti chiedi dove porta",
          nextId: "e_13"
        },
        {
          label: "Ti chiedi cosa succede lì di notte",
          nextId: "c_13"
        },
        {
          label: "Guardi se qualche simbolo o indicazione dice dove porta",
          nextId: "d_13"
        },
        {
          label: "Ti chiedi cosa è successp lì",
          nextId: "a_13"
        }
      ]
    },
    {
      id: "p6",
      text: "Ti danno un bicchiere di çay",
      answers: [
        {
          label: "Pensi alla tradizione dietro alla preparazione",
          nextId: "c_16"
        },
        {
          label: "Lo bevi e riparti subito",
          nextId: "e_16"
        },
        {
          label: "Osservi il modo in cui viene servito",
          nextId: "d_16"
        },
        {
          label: "Ti chiedi chi lo abbia inventato",
          nextId: "cu_16"
        }
      ]
    },
    {
      id: "p7",
      text: "Vedi un simbolo blu appeso ovunque",
      answers: [
        {
          label: "Chiedi a qualcuno cosa significa",
          nextId: "cu_19"
        },
        {
          label: "Ti chiedi che storia c'è dietro",
          nextId: "c_19"
        },
        {
          label: "Lo osservi nei dettagli",
          nextId: "d_19"
        },
        {
          label: "Ti chiedi da quando esiste",
          nextId: "a_19"
        }
      ]
    },
    {
      id: "p8",
      text: "Stai scegliendo cosa fotografare",
      answers: [
        {
          label: "Una strada",
          nextId: "e_22"
        },
        {
          label: "Un luogo con una storia",
          nextId: "a_22"
        },
        {
          label: "Un momento tra persone",
          nextId: "cu_22"
        },
        {
          label: "Un dettaglio",
          nextId: "d_22"
        }
      ]
    },
    {
      id: "p9",
      text: "Qualcuno racconta una leggenda su un luogo",
      answers: [
        {
          label: "Ti interessa capire se è vera",
          nextId: "a_25"
        },
        {
          label: "Ti interessa la storia in sè",
          nextId: "c_25"
        },
        {
          label: "Ti interessa andare a vedere il posto",
          nextId: "e_25"
        },
        {
          label: "Ti interessa cosa rappresenta",
          nextId: "d_25"
        }
      ]
    },
    {
      id: "p10",
      text: "Fine giornata, ripensi a quello che hai visto:",
      answers: [
        {
          label: "Le persone incontrate",
          nextId: "cu_28"
        },
        {
          label: "Le storie strane",
          nextId: "c_28"
        },
        {
          label: "I percorsi fatti",
          nextId: "e_28"
        },
        {
          label: "I dettagli notati",
          nextId: "d_28"
        }
      ]
    },
    {
      id: "a_1",
      text: "Istanbul è stata capitale di quanti imperi?",
      answers: [
        {
          label: "1",
          nextId: "a_2",
          feedback: "È stata capitale dell'impero romano, bizantino e ottomano"
        },
        {
          label: "2",
          nextId: "a_2",
          feedback: "È stata capitale dell'impero romano, bizantino e ottomano"
        
        },
        {
          label: "3",
          nextId: "a_2",
          feedback: "È stata capitale dell'impero romano, bizantino e ottomano"
        },
        {
          label: "4",
          nextId: "a_2",
          feedback: "È stata capitale dell'impero romano, bizantino e ottomano"
        }
      ]
    },
    {
      id: "a_2",
      text: "Prima di chiamarsi Istanbul come si chiamava?",
      answers: [
        {
          label: "Troia",
          nextId: "a_3",
          feedback: "Costantinopoli è stato il nome principale per oltre 1000 anni"
        },
        {
          label: "Costantinopoli",
          nextId: "a_3",
          feedback: "Costantinopoli è stato il nome principale per oltre 1000 anni"
        
        },
        {
          label: "Efeso",
          nextId: "a_3",
          feedback: "Costantinopoli è stato il nome principale per oltre 1000 anni"
        },
        {
          label: "Antiochia",
          nextId: "a_3",
          feedback: "Costantinopoli è stato il nome principale per oltre 1000 anni"
        }
      ]
    },
    {
      id: "a_3",
      text: "Chi conquistò Costantinopoli nel 1453?",
      answers: [
        {
          label: "Alessandro Magno",
          nextId: "p2",
          feedback: "Mehemet II, detto 'Il Conquistatore' aveva solo 21 anni"
        },
        {
          label: "Mehmet II",
          nextId: "p2",
          feedback: "Mehemet II, detto 'Il Conquistatore' aveva solo 21 anni"
        },
        {
          label: "Cesare",
          nextId: "p2",
          feedback: "Mehemet II, detto 'Il Conquistatore' aveva solo 21 anni"
        },
        {
          label: "Napoleone",
          nextId: "p2",
          feedback: "Mehemet II, detto 'Il Conquistatore' aveva solo 21 anni"
        }
      ]
    },
    {
      id: "a_7",
      text: "Quale edificio è stato sia chiesa che moschea?",
      answers: [
        {
          label: "Topkapi",
          nextId: "a_8",
          feedback: "Hagia Sophia è uno dei simboli più incredibili della città"
        },
        {
          label: "Hagia Sophia",
          nextId: "a_8",
          feedback: "Hagia Sophia è uno dei simboli più incredibili della città"
        },
        {
          label: "Moschea Blu",
          nextId: "a_8",
          feedback: "Hagia Sophia è uno dei simboli più incredibili della città"
        },
        {
          label: "Dolmabahçe",
          nextId: "a_8",
          feedback: "Hagia Sophia è uno dei simboli più incredibili della città"
        }
      ]
    },
    {
      id: "a_8",
      text: "Il Grand Bazar nasce",
      answers: [
        {
          label: "Nel 1800",
          nextId: "a_9",
          feedback: "Nel 1400, è uno dei mercati coperti più antichi del mondo"
        },
        {
          label: "Nel 1200",
          nextId: "a_9",
          feedback: "Nel 1400, è uno dei mercati coperti più antichi del mondo"
        },
        {
          label: "Nel 1400",
          nextId: "a_9",
          feedback: "Nel 1400, è uno dei mercati coperti più antichi del mondo"
        },
        {
          label: "Nel 1900",
          nextId: "a_9",
          feedback: "Nel 1400, è uno dei mercati coperti più antichi del mondo"
        }
      ]
    },
    {
      id: "a_9",
      text: "Il palazzo Topkapi era",
      answers: [
        {
          label: "Una fortezza militare",
          nextId: "p4",
          feedback: "La residenza dei sultani: fu il centro del potere ottomano per secoli"
        },
        {
          label: "La residenza dei sultani",
          nextId: "p4",
          feedback: "La residenza dei sultani: fu il centro del potere ottomano per secoli"
        },
        {
          label: "Un tempio",
          nextId: "p4",
          feedback: "La residenza dei sultani: fu il centro del potere ottomano per secoli"
        },
        {
          label: "Un mercato",
          nextId: "p4",
          feedback: "La residenza dei sultani: fu il centro del potere ottomano per secoli"
        }
      ]
    },
    {
      id: "a_13",
      text: "Il nome Istanbul probabilmente deriva da:",
      answers: [
        {
          label: "Latino",
          nextId: "a_14",
          feedback: "Deriva dall'espressione greca 'èis tèn pòlin' che significa 'verso la città'."
        },
        {
          label: "Greco",
          nextId: "a_14",
          feedback: "Deriva dall'espressione greca 'èis tèn pòlin' che significa 'verso la città'."
        },
        {
          label: "Arabo",
          nextId: "a_14",
          feedback: "Deriva dall'espressione greca 'èis tèn pòlin' che significa 'verso la città'."
        },
        {
          label: "Persiano",
          nextId: "a_14",
          feedback: "Deriva dall'espressione greca 'èis tèn pòlin' che significa 'verso la città'."
        }
      ]
    },
    {
      id: "a_14",
      text: "Hagia Sofia è stata costruita in:",
      answers: [
        {
          label: "10 anni",
          nextId: "a_15",
          feedback: "Fu incredibilmente costruita in 5 anni"
        },
        {
          label: "50 anni",
          nextId: "a_15",
          feedback: "Fu incredibilmente costruita in 5 anni"
        },
        {
          label: "5 anni",
          nextId: "a_15",
          feedback: "Fu incredibilmente costruita in 5 anni"
        },
        {
          label: "100 anni",
          nextId: "a_15",
          feedback: "Fu incredibilmente costruita in 5 anni"
        }
      ]
    },
    {
      id: "a_15",
      text: "I sultani ottomani vivevano:",
      answers: [
        {
          label: "Sempre nello stesso palazzo",
          nextId: "p5",
          feedback: "Topkapi era praticamente una città dentro la città"
        },
        {
          label: "In tende",
          nextId: "p5",
          feedback: "Topkapi era praticamente una città dentro la città"
        },
        {
          label: "In un complesso enorme con centinaia di stanze",
          nextId: "p5",
          feedback: "Topkapi era praticamente una città dentro la città"
        },
        {
          label: "In castelli separati",
          nextId: "p5",
          feedback: "Topkapi era praticamente una città dentro la città"
        }
      ]
    }
  ]
};
