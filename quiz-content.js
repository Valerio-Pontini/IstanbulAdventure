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
          nextId: "a_1"
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
          nextId: "p6",
          feedback: "Topkapi era praticamente una città dentro la città"
        },
        {
          label: "In tende",
          nextId: "p6",
          feedback: "Topkapi era praticamente una città dentro la città"
        },
        {
          label: "In un complesso enorme con centinaia di stanze",
          nextId: "p6",
          feedback: "Topkapi era praticamente una città dentro la città"
        },
        {
          label: "In castelli separati",
          nextId: "p6",
          feedback: "Topkapi era praticamente una città dentro la città"
        }
      ]
    },
    {
      id: "a_19",
      text: "Le mura di Costantinopoli avevano:",
      answers: [
        {
          label: "Una sola linea",
          nextId: "a_20",
          feedback: "Tre livelli difensivi: fossa, mura esterne e interne"
        },
        {
          label: "Due linee",
          nextId: "a_20",
          feedback: "Tre livelli difensivi: fossa, mura esterne e interne"
        },
        {
          label: "Tre linee",
          nextId: "a_20",
          feedback: "Tre livelli difensivi: fossa, mura esterne e interne"
        },
        {
          label: "Nessuna linea",
          nextId: "a_20",
          feedback: "Tre livelli difensivi: fossa, mura esterne e interne"
        }
      ]
    },
    {
      id: "a_20",
      text: "Durante l'assedio del 1453, gli ottomani:",
      answers: [
        {
          label: "Scavarono sotto la città",
          nextId: "a_21",
          feedback: "Trasportarono navi su terra per aggirare le difese"
        },
        {
          label: "Portarono navi via terra",
          nextId: "a_21",
          feedback: "Trasportarono navi su terra per aggirare le difese"
        },
        {
          label: "Usarono solo archi",
          nextId: "a_21",
          feedback: "Trasportarono navi su terra per aggirare le difese"
        },
        {
          label: "Aspettarono",
          nextId: "a_21",
          feedback: "Trasportarono navi su terra per aggirare le difese"
        }
      ]
    },
    {
      id: "a_21",
      text: "Hagia Sofia ha:",
      answers: [
        {
          label: "Solo mosaici cristiani",
          nextId: "p8",
          feedback: "Entrambi, un mix unico di simboli religiosi"
        },
        {
          label: "Solo elementi islamici",
          nextId: "p8",
          feedback: "Entrambi, un mix unico di simboli religiosi"
        },
        {
          label: "Entrambi",
          nextId: "p8",
          feedback: "Entrambi, un mix unico di simboli religiosi"
        },
        {
          label: "Nessuno",
          nextId: "p8",
          feedback: "Entrambi, un mix unico di simboli religiosi"
        }
      ]
    },
    {
      id: "a_22",
      text: "La Cisterna Basilica era:",
      answers: [
        {
          label: "Una prigione",
          nextId: "a_23",
          feedback: "Serviva a immagazzinare acqua per la città"
        },
        {
          label: "Un magazzino d'acqa",
          nextId: "a_23",
          feedback: "Serviva a immagazzinare acqua per la città"
        },
        {
          label: "Un tempio",
          nextId: "a_23",
          feedback: "Serviva a immagazzinare acqua per la città"
        },
        {
          label: "Un teatro",
          nextId: "a_23",
          feedback: "Serviva a immagazzinare acqua per la città"
        }
      ]
    },
    {
      id: "a_23",
      text: "Le teste di Medusa nella cisterna sono:",
      answers: [
        {
          label: "Colorate",
          nextId: "a_24",
          feedback: "Capovolte. Posizione misteriosa e molto discussa"
        },
        {
          label: "Distrutte",
          nextId: "a_24",
          feedback: "Capovolte. Posizione misteriosa e molto discussa"
        },
        {
          label: "Capovolte",
          nextId: "a_24",
          feedback: "Capovolte. Posizione misteriosa e molto discussa"
        },
        {
          label: "Divise",
          nextId: "a_24",
          feedback: "Capovolte. Posizione misteriosa e molto discussa"
        }
      ]
    },
    {
      id: "a_24",
      text: "I Giannizzeri (guardie d'èlite) erano",
      answers: [
        {
          label: "Tutti turchi",
          nextId: "p9",
          feedback: "Bambini presi da altre regioni. Venivano reclutati da giovani e addestrati per servire il sultano"
        },
        {
          label: "Bambini presi da altre regioni",
          nextId: "p9",
          feedback: "Bambini presi da altre regioni. Venivano reclutati da giovani e addestrati per servire il sultano"
        },
        {
          label: "Mercenari europei",
          nextId: "p9",
          feedback: "Bambini presi da altre regioni. Venivano reclutati da giovani e addestrati per servire il sultano"
        },
        {
          label: "Nobili",
          nextId: "p9",
          feedback: "Bambini presi da altre regioni. Venivano reclutati da giovani e addestrati per servire il sultano"
        }
      ]
    },
    {
      id: "a_25",
      text: "Alcuni mosaici di Hagia Sophia sono stati:",
      answers: [
        {
          label: "Distrutti",
          nextId: "a_26",
          feedback: "Furono coperti durante il periodo ottomano e riscoperti dopo"
        },
        {
          label: "Coperti per secoli",
          nextId: "a_26",
          feedback: "Furono coperti durante il periodo ottomano e riscoperti dopo"
        },
        {
          label: "Rubati",
          nextId: "a_26",
          feedback: "Furono coperti durante il periodo ottomano e riscoperti dopo"
        },
        {
          label: "Dipinti",
          nextId: "a_26",
          feedback: "Furono coperti durante il periodo ottomano e riscoperti dopo"
        }
      ]
    },
    {
      id: "a_26",
      text: "Il Tünel di Istanbul è considerato:",
      answers: [
        {
          label: "La prima metro al mondo",
          nextId: "a_27",
          feedback: "è il secondo sistema sotterraneo urbano più antico dopo Londra"
        },
        {
          label: "La seconda metro al mondo",
          nextId: "a_27",
          feedback: "è il secondo sistema sotterraneo urbano più antico dopo Londra"
        },
        {
          label: "Un ascensore turistico",
          nextId: "a_27",
          feedback: "è il secondo sistema sotterraneo urbano più antico dopo Londra"
        },
        {
          label: "Una funivia moderna",
          nextId: "a_27",
          feedback: "è il secondo sistema sotterraneo urbano più antico dopo Londra"
        }
      ]
    },
    {
      id: "a_27",
      text: "Le cucine del palazzo Topkapi:",
      answers: [
        {
          label: "Servivano solo il sultano",
          nextId: "p10",
          feedback: "Preparavano migliaia di pasti al giorno. Una vera macchina logistica imperiale"
        },
        {
          label: "Preparavano migliaia di pasti al giorno",
          nextId: "p10",
          feedback: "Preparavano migliaia di pasti al giorno. Una vera macchina logistica imperiale"
        },
        {
          label: "Erano il nascondiglio del tesoro reale",
          nextId: "p10",
          feedback: "Preparavano migliaia di pasti al giorno. Una vera macchina logistica imperiale"
        },
        {
          label: "Non furono mai utilizzate",
          nextId: "p10",
          feedback: "Preparavano migliaia di pasti al giorno. Una vera macchina logistica imperiale"
        }
      ]
    },
    {
      id: "c_1",
      text: "Secondo una leggenda, la Torre della Fanciulla serviva a:",
      answers: [
        { label: "Difendere la città", nextId: "c_2", feedback: "Tenere al sicuro una principessa. Fu isolata lì per sfuggire a una profezia." },
        { label: "Tenere al sicuro una principessa", nextId: "c_2", feedback: "Tenere al sicuro una principessa. Fu isolata lì per sfuggire a una profezia." },
        { label: "Nascondere un tesoro", nextId: "c_2", feedback: "Tenere al sicuro una principessa. Fu isolata lì per sfuggire a una profezia." },
        { label: "Controllare il traffico marittimo", nextId: "c_2", feedback: "Tenere al sicuro una principessa. Fu isolata lì per sfuggire a una profezia." }
      ]
    },
  {
    id: "c_2",
    text: "Nella leggenda della Torre della Fanciulla, cosa uccide la principessa?",
    answers: [
      { label: "Un soldato", nextId: "c_3", feedback: "Un serpente nascosto. Arrivò in un cesto di frutta." },
      { label: "Un serpente nascosto", nextId: "c_3", feedback: "Un serpente nascosto. Arrivò in un cesto di frutta." },
      { label: "Un crollo", nextId: "c_3", feedback: "Un serpente nascosto. Arrivò in un cesto di frutta." },
      { label: "Una malattia", nextId: "c_3", feedback: "Un serpente nascosto. Arrivò in un cesto di frutta." }
    ]
  },
  {
    id: "c_3",
    text: "Secondo alcune credenze, il malocchio viene causato da:",
    answers: [
      { label: "Il vento", nextId: "p2", feedback: "Lo sguardo invidioso. Il nazar serve a proteggersi da questo." },
      { label: "Lo sguardo invidioso", nextId: "p2", feedback: "Lo sguardo invidioso. Il nazar serve a proteggersi da questo." },
      { label: "Gli animali", nextId: "p2", feedback: "Lo sguardo invidioso. Il nazar serve a proteggersi da questo." },
      { label: "Il buio", nextId: "p2", feedback: "Lo sguardo invidioso. Il nazar serve a proteggersi da questo." }
    ]
  },
  {
    id: "c_4",
    text: "Secondo alcune storie, i gatti di Istanbul sono:",
    answers: [
      { label: "Animali normali", nextId: "c_5", feedback: "Custodi della città. Sono visti come osservatori silenziosi." },
      { label: "Custodi della città", nextId: "c_5", feedback: "Custodi della città. Sono visti come osservatori silenziosi." },
      { label: "Animali sacri", nextId: "c_5", feedback: "Custodi della città. Sono visti come osservatori silenziosi." },
      { label: "Animali randagi senza ruolo", nextId: "c_5", feedback: "Custodi della città. Sono visti come osservatori silenziosi." }
    ]
  },
    {
      id: "c_5",
      text: "Quale rito popolare si associa comunemente alla colonna nella Moschea Blu di Istanbul?",
      answers: [
        { label: "Inserire il pollice nel foro e girarlo", nextId: "c_6", feedback: "Il rito consiste nell'inserire il pollice in un piccolo foro della colonna e ruotarlo esprimendo un desiderio." },
        { label: "Baciare la colonna di pietra", nextId: "c_6", feedback: "Il rito consiste nell'inserire il pollice in un piccolo foro della colonna e ruotarlo esprimendo un desiderio." },
        { label: "Lucidare la colonna con olio sacro", nextId: "c_6", feedback: "Il rito consiste nell'inserire il pollice in un piccolo foro della colonna e ruotarlo esprimendo un desiderio." },
        { label: "Portare offerte di fiori", nextId: "c_6", feedback: "Il rito consiste nell'inserire il pollice in un piccolo foro della colonna e ruotarlo esprimendo un desiderio." }
      ]
    },
    { id: "c_6", text: "Qual è l’unica fonte letteraria nota che racconta il volo di Hezarfen?", answers: [
      { label: "Il Séyahatnâme di Evliya Çelebi", label: "p3", feedback: "Il volo è descritto solo nel *Seyahatnâme* di Evliya Çelebi【14†L103-L110】." },
      { label: "Un salmo bizantino", label: "p3", feedback: "Il volo è descritto solo nel *Seyahatnâme* di Evliya Çelebi【14†L103-L110】." },
      { label: "Un diario ottomano", label: "p3", feedback: "Il volo è descritto solo nel *Seyahatnâme* di Evliya Çelebi【14†L103-L110】." },
      { label: "Un cronaca persiana", label: "p3", feedback: "Il volo è descritto solo nel *Seyahatnâme* di Evliya Çelebi【14†L103-L110】." }
    ] },
    { id: "c_7", text: "Qual è il soprannome turco della Cisterna Basilica?", answers: [
      { label: "Yerebatan Sarayı (Palazzo sommerso)", label: "c_8", feedback: "È comunemente chiamata **Yerebatan Sarayı**, che significa 'Palazzo sommerso'【15†L149-L156】." },
      { label: "Subterraneo Regale", label: "c_8", feedback: "È comunemente chiamata **Yerebatan Sarayı**, che significa 'Palazzo sommerso'【15†L149-L156】." },
      { label: "Abisso di Giustiniano", label: "c_8", feedback: "È comunemente chiamata **Yerebatan Sarayı**, che significa 'Palazzo sommerso'【15†L149-L156】." },
      { label: "Sala delle Meduse", label: "c_8", feedback: "È comunemente chiamata **Yerebatan Sarayı**, che significa 'Palazzo sommerso'【15†L149-L156】." }
    ] },
    { id: "c_8", text: "Come viene rappresentata Şahmeran nella mitologia turca?", answers: [
      { label: "Metà donna, metà serpente", label: "c_9", feedback: "Şahmeran è descritta come un essere mitologico metà donna e metà serpente." },
      { label: "Un drago alato", label: "c_9", feedback: "Şahmeran è descritta come un essere mitologico metà donna e metà serpente." },
      { label: "Una ninfa dei boschi", label: "c_9", feedback: "Şahmeran è descritta come un essere mitologico metà donna e metà serpente." },
      { label: "Una statua vivente", label: "c_9", feedback: "Şahmeran è descritta come un essere mitologico metà donna e metà serpente." }
    ] },
    { id: "c_9", text: "Nasreddin Hoca è celebre per racconti di quale genere?", answers: [
      { label: "Umorismo paradossale", label: "p4", feedback: "Nasreddin è noto per racconti umoristici che capovolgono la logica comune." },
      { label: "Tragedie storiche", label: "p4", feedback: "Nasreddin è noto per racconti umoristici che capovolgono la logica comune." },
      { label: "Scienza e invenzioni", label: "p4", feedback: "Nasreddin è noto per racconti umoristici che capovolgono la logica comune." },
      { label: "Ricette culinarie", label: "p4", feedback: "Nasreddin è noto per racconti umoristici che capovolgono la logica comune." }
    ] },
    { id: "c_10", text: "Chi è Dede Korkut nelle saghe turche?", answers: [
      { label: "Saggio narratore e consigliere epico", label: "c_11", feedback: "Dede Korkut è il saggio narratore e figura guida nell’epica popolare degli Oghuz." },
      { label: "Re guerriero degli imperatori", label: "c_11", feedback: "Dede Korkut è il saggio narratore e figura guida nell’epica popolare degli Oghuz." },
      { label: "Demone della foresta", label: "c_11", feedback: "Dede Korkut è il saggio narratore e figura guida nell’epica popolare degli Oghuz." },
      { label: "Drago marino", label: "c_11", feedback: "Dede Korkut è il saggio narratore e figura guida nell’epica popolare degli Oghuz." }
    ] },
    { id: "c_11", text: "Chi sono Karagöz e Hacivat?", answers: [
      { label: "Personaggi del teatro di ombre turco", label: "c_12", feedback: "Karagöz e Hacivat sono i protagonisti del tradizionale teatro di ombre turco (teatro di figura)【13†L166-L174】." },
      { label: "Due moschee a Istanbul", label: "c_12", feedback: "Karagöz e Hacivat sono i protagonisti del tradizionale teatro di ombre turco (teatro di figura)【13†L166-L174】." },
      { label: "Due re della dinastia ottomana", label: "c_12", feedback: "Karagöz e Hacivat sono i protagonisti del tradizionale teatro di ombre turco (teatro di figura)【13†L166-L174】." },
      { label: "Due montagne sacre", label: "c_12", feedback: "Karagöz e Hacivat sono i protagonisti del tradizionale teatro di ombre turco (teatro di figura)【13†L166-L174】." }
    ] },
    { id: "c_12", text: "Quale sultano ottomano introdusse il caffè in Turchia secondo la leggenda?", answers: [
      { label: "Solimano il Magnifico", label: "p5", feedback: "Secondo la tradizione, il caffè entrò in uso all’epoca di Solimano il Magnifico nel XVI secolo【11†L376-L384】." },
      { label: "Mehmed II", label: "p5", feedback: "Secondo la tradizione, il caffè entrò in uso all’epoca di Solimano il Magnifico nel XVI secolo【11†L376-L384】." },
      { label: "Suleyman il Vecchio", label: "p5", feedback: "Secondo la tradizione, il caffè entrò in uso all’epoca di Solimano il Magnifico nel XVI secolo【11†L376-L384】." },
      { label: "Mahmud il II", label: "p5", feedback: "Secondo la tradizione, il caffè entrò in uso all’epoca di Solimano il Magnifico nel XVI secolo【11†L376-L384】." }
    ] },
    { id: "c_13", text: "Cosa racconta la leggenda sulla resa dei turchi a Vienna nel 1683 legata al caffè?", answers: [
      { label: "Abbandono di sacchi di caffè", label: "c_14", feedback: "La leggenda narra che i turchi, sconfitti a Vienna, abbandonarono sacchi di caffè, così il caffè entrò in Europa【11†L380-L388】." },
      { label: "Riscatto con caffè speziato", label: "c_14", feedback: "La leggenda narra che i turchi, sconfitti a Vienna, abbandonarono sacchi di caffè, così il caffè entrò in Europa【11†L380-L388】." },
      { label: "Tariffa caffè imposto", label: "c_14", feedback: "La leggenda narra che i turchi, sconfitti a Vienna, abbandonarono sacchi di caffè, così il caffè entrò in Europa【11†L380-L388】." },
      { label: "Volo de l caffè portato da angeli", label: "c_14", feedback: "La leggenda narra che i turchi, sconfitti a Vienna, abbandonarono sacchi di caffè, così il caffè entrò in Europa【11†L380-L388】." }
    ] },
    { id: "c_14", text: "Quale libro di viaggio del 1600 menziona il volo di Hezarfen?", answers: [
      { label: "Seyahatnâme di Evliya Çelebi", label: "c_15", feedback: "Il volo di Hezarfen è raccontato nel *Seyahatnâme* di Evliya Çelebi (XVII secolo)【14†L103-L110】." },
      { label: "Le Mille e una Notte", label: "c_15", feedback: "Il volo di Hezarfen è raccontato nel *Seyahatnâme* di Evliya Çelebi (XVII secolo)【14†L103-L110】." },
      { label: "Divan di Rumi", label: "c_15", feedback: "Il volo di Hezarfen è raccontato nel *Seyahatnâme* di Evliya Çelebi (XVII secolo)【14†L103-L110】." },
      { label: "Enciclopedia del Cielo", label: "c_15", feedback: "Il volo di Hezarfen è raccontato nel *Seyahatnâme* di Evliya Çelebi (XVII secolo)【14†L103-L110】." }
    ] },
    { id: "c_15", text: "Cosa significa il nome Şahmeran nella lingua persiana?", answers: [
      { label: "Re dei serpenti", label: "p6", feedback: "Il nome Şahmeran significa letteralmente **\"Re dei serpenti\"** (persiano shah: re, maran: serpenti)." },
      { label: "Signora delle acque", label: "p6", feedback: "Il nome Şahmeran significa letteralmente **\"Re dei serpenti\"** (persiano shah: re, maran: serpenti)." },
      { label: "Regina delle fate", label: "p6", feedback: "Il nome Şahmeran significa letteralmente **\"Re dei serpenti\"** (persiano shah: re, maran: serpenti)." },
      { label: "Dea della saggezza", label: "p6", feedback: "Il nome Şahmeran significa letteralmente **\"Re dei serpenti\"** (persiano shah: re, maran: serpenti)." }
    ] },
    { id: "c_16", text: "Secondo la leggenda, quale segno compare sul corpo di chi vede Şahmeran?", answers: [
      { label: "Squame serpentine", label: "c_17", feedback: "Si narra che chi vede Şahmeran sviluppa delle **squame serpentine** sul corpo." },
      { label: "Ali d'angelo", label: "c_17", feedback: "Si narra che chi vede Şahmeran sviluppa delle **squame serpentine** sul corpo." },
      { label: "Occhi di fuoco", label: "c_17", feedback: "Si narra che chi vede Şahmeran sviluppa delle **squame serpentine** sul corpo." },
      { label: "Nessun segno", label: "c_17", feedback: "Si narra che chi vede Şahmeran sviluppa delle **squame serpentine** sul corpo." }
    ] },
    { id: "c_17", text: "Secondo il mito di Ergenekon, in quale luogo leggendario i Turchi furono imprigionati?", answers: [
      { label: "Valle di Ergenekon", label: "c_18", feedback: "Il mito narra che gli antichi Turchi furono rinchiusi nella valle di **Ergenekon** fino alla loro liberazione." },
      { label: "Grotta di Çatalhöyük", label: "c_18", feedback: "Il mito narra che gli antichi Turchi furono rinchiusi nella valle di **Ergenekon** fino alla loro liberazione." },
      { label: "Isola di Creta", label: "c_18", feedback: "Il mito narra che gli antichi Turchi furono rinchiusi nella valle di **Ergenekon** fino alla loro liberazione." },
      { label: "Deserto di Gobi", label: "c_18", feedback: "Il mito narra che gli antichi Turchi furono rinchiusi nella valle di **Ergenekon** fino alla loro liberazione." }
    ] },
    { id: "c_18", text: "Cos’è l’Anka kuşu nella mitologia turca?", answers: [
      { label: "La fenice mitica", label: "p7", feedback: "L’**Anka kuşu** è la figura della fenice nella mitologia turca, un uccello leggendario che rinasce dalle proprie ceneri." },
      { label: "Una montagna sacra", label: "p7", feedback: "L’**Anka kuşu** è la figura della fenice nella mitologia turca, un uccello leggendario che rinasce dalle proprie ceneri." },
      { label: "Un eroe epico", label: "p7", feedback: "L’**Anka kuşu** è la figura della fenice nella mitologia turca, un uccello leggendario che rinasce dalle proprie ceneri." },
      { label: "Una pianta medicinale", label: "p7", feedback: "L’**Anka kuşu** è la figura della fenice nella mitologia turca, un uccello leggendario che rinasce dalle proprie ceneri." }
    ] },
    { id: "c_19", text: "Quale figura leggendaria è strettamente associata alle acque e alla guarigione nella tradizione popolare turca?", answers: [
      { label: "Khidr (Hızır)", label: "c_20", feedback: "Il profeta leggendario **Khidr (Hızır)** è spesso associato a sorgenti sacre e guarigione nella tradizione popolare turca." },
      { label: "Orfeo", label: "c_20", feedback: "Il profeta leggendario **Khidr (Hızır)** è spesso associato a sorgenti sacre e guarigione nella tradizione popolare turca." },
      { label: "Aquila", label: "c_20", feedback: "Il profeta leggendario **Khidr (Hızır)** è spesso associato a sorgenti sacre e guarigione nella tradizione popolare turca." },
      { label: "Pandora", label: "c_20", feedback: "Il profeta leggendario **Khidr (Hızır)** è spesso associato a sorgenti sacre e guarigione nella tradizione popolare turca." }
    ] },
    { id: "c_20", text: "Nel mito di Ergenekon, come fu liberato il popolo dalla valle leggendaria?", answers: [
      { label: "Un fabbro forgiò una spada e aprì la montagna", label: "c_21", feedback: "La leggenda dice che un fabbro forgiò una spada e ruppe la montagna di Ergenekon, liberando così il popolo." },
      { label: "Un angelo discese dal cielo", label: "c_21", feedback: "La leggenda dice che un fabbro forgiò una spada e ruppe la montagna di Ergenekon, liberando così il popolo." },
      { label: "Un drago sorvolò la valle", label: "c_21", feedback: "La leggenda dice che un fabbro forgiò una spada e ruppe la montagna di Ergenekon, liberando così il popolo." },
      { label: "Un re spezzò la valle con il suo scettro", label: "c_21", feedback: "La leggenda dice che un fabbro forgiò una spada e ruppe la montagna di Ergenekon, liberando così il popolo." }
    ] },
    {
    id: "c_21",
    text: "Quale figura leggendaria appare nella notte di Hıdrellez secondo la tradizione?",
    answers: [
      { label: "Hızır", label: "p8", feedback: "Durante Hıdrellez si crede che appaia **Hızır**, figura misteriosa associata a fortuna, guarigione e desideri realizzati." },
      { label: "Ercole", label: "p8", feedback: "Durante Hıdrellez si crede che appaia **Hızır**, figura misteriosa associata a fortuna, guarigione e desideri realizzati." },
      { label: "Odino", label: "p8", feedback: "Durante Hıdrellez si crede che appaia **Hızır**, figura misteriosa associata a fortuna, guarigione e desideri realizzati." },
      { label: "Anubi", label: "p8", feedback: "Durante Hıdrellez si crede che appaia **Hızır**, figura misteriosa associata a fortuna, guarigione e desideri realizzati." }
    ]
  },
  {
    id: "c_25",
    text: "Secondo alcune leggende, cosa succede di notte nella Cisterna Basilica?",
    answers: [
      { label: "Si sentono voci e sussurri", label: "c_26", feedback: "Molte storie raccontano che nella Cisterna Basilica si sentano **voci e sussurri**, alimentando l’atmosfera misteriosa del luogo sotterraneo." },
      { label: "L'acqua scompare", label: "c_26", feedback: "Molte storie raccontano che nella Cisterna Basilica si sentano **voci e sussurri**, alimentando l’atmosfera misteriosa del luogo sotterraneo." },
      { label: "Le statue si muovono", label: "c_26", feedback: "Molte storie raccontano che nella Cisterna Basilica si sentano **voci e sussurri**, alimentando l’atmosfera misteriosa del luogo sotterraneo." },
      { label: "Appare un re", label: "c_26", feedback: "Molte storie raccontano che nella Cisterna Basilica si sentano **voci e sussurri**, alimentando l’atmosfera misteriosa del luogo sotterraneo." }
    ]
  },
  {
    id: "c_26",
    text: "Chi era Şahmeran nella tradizione anatolica?",
    answers: [
      { label: "Una regina dei serpenti", label: "c_27", feedback: "Şahmeran è una figura leggendaria metà donna e metà serpente, considerata la **regina dei serpenti e simbolo di conoscenza e saggezza nascosta**." },
      { label: "Una guerriera umana", label: "c_27", feedback: "Şahmeran è una figura leggendaria metà donna e metà serpente, considerata la **regina dei serpenti e simbolo di conoscenza e saggezza nascosta**." },
      { label: "Una dea del mare", label: "c_27", feedback: "Şahmeran è una figura leggendaria metà donna e metà serpente, considerata la **regina dei serpenti e simbolo di conoscenza e saggezza nascosta**." },
      { label: "Una strega malvagia", label: "c_27", feedback: "Şahmeran è una figura leggendaria metà donna e metà serpente, considerata la **regina dei serpenti e simbolo di conoscenza e saggezza nascosta**." }
    ]
  },
  {
    id: "c_27",
    text: "Quale figura mitologica turca rappresenta un uccello immortale che rinasce?",
    answers: [
      { label: "Anka", label: "p10", feedback: "L’**Anka** è un uccello mitologico simile alla fenice, simbolo di rinascita e immortalità nella tradizione turca." },
      { label: "Simurgh", label: "p10", feedback: "L’**Anka** è un uccello mitologico simile alla fenice, simbolo di rinascita e immortalità nella tradizione turca." },
      { label: "Grifone", label: "p10", feedback: "L’**Anka** è un uccello mitologico simile alla fenice, simbolo di rinascita e immortalità nella tradizione turca." },
      { label: "Pegaso", label: "p10", feedback: "L’**Anka** è un uccello mitologico simile alla fenice, simbolo di rinascita e immortalità nella tradizione turca." }
    ]
  },
  { id: "cu_4",
  text: "Qual è la bevanda tradizionale turca servita in piccoli bicchieri a forma di tulipano?",
  answers: [
    { label: "Caffè turco", nextId: "cu_5", feedback: "Il tè (çay) è la bevanda nazionale turca, servita in bicchieri a tulipano ed elemento centrale della vita sociale." },
    { label: "Tè turco (çay)", nextId: "cu_5", feedback: "Il tè (çay) è la bevanda nazionale turca, servita in bicchieri a tulipano ed elemento centrale della vita sociale." },
    { label: "Ayran", nextId: "cu_5", feedback: "Il tè (çay) è la bevanda nazionale turca, servita in bicchieri a tulipano ed elemento centrale della vita sociale." },
    { label: "Salep", nextId: "cu_5", feedback: "Il tè (çay) è la bevanda nazionale turca, servita in bicchieri a tulipano ed elemento centrale della vita sociale." }
  ]
},
{ id: "cu_5",
  text: "Il caffè turco tradizionale viene preparato in un recipiente chiamato:",
  answers: [
    { label: "Ibrik", nextId: "cu_6", feedback: "Il caffè turco si prepara nel cezve (detto anche ibrik), piccolo bricco con manico lungo." },
    { label: "Cezve", nextId: "cu_6", feedback: "Il caffè turco si prepara nel cezve (detto anche ibrik), piccolo bricco con manico lungo." },
    { label: "Samovar", nextId: "cu_6", feedback: "Il caffè turco si prepara nel cezve (detto anche ibrik), piccolo bricco con manico lungo." },
    { label: "Tandir", nextId: "cu_6", feedback: "Il caffè turco si prepara nel cezve (detto anche ibrik), piccolo bricco con manico lungo." }
  ]
},
{ id: "cu_6",
  text: "Quale dolce ottomano è composto da sottilissimi strati di pasta fillo, pistacchi e sciroppo?",
  answers: [
    { label: "Lokum", nextId: "p3", feedback: "La baklava è un dolce ottomano a strati di pasta fillo, frutta secca e sciroppo." },
    { label: "Baklava", nextId: "p3", feedback: "La baklava è un dolce ottomano a strati di pasta fillo, frutta secca e sciroppo." },
    { label: "Kadayif", nextId: "p3", feedback: "La baklava è un dolce ottomano a strati di pasta fillo, frutta secca e sciroppo." },
    { label: "Simit", nextId: "p3", feedback: "La baklava è un dolce ottomano a strati di pasta fillo, frutta secca e sciroppo." }
  ]
},
  ]
};
