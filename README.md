# TravelGame App Shell

Base mobile-first pensata per una webapp visualizzata principalmente su smartphone.

## Struttura

- `index.html`: entrypoint dell'app.
- `src/main.js`: bootstrap dell'interfaccia.
- `src/state/`: dati e view model iniziali.
- `src/ui/`: rendering dei componenti principali.
- `src/styles/`: token, reset, layout e componenti separati.

## Linee guida incluse

- layout centrato con larghezza massima da telefono;
- supporto a `safe-area-inset` per dispositivi full-screen;
- shell con topbar, contenuto scrollabile e bottom navigation persistente;
- CSS organizzato per facilitare un futuro design system;
- JavaScript modulare pronto per routing, stato applicativo o chiamate API.

## Avvio rapido

Puoi aprire `index.html` direttamente nel browser oppure servire la cartella con un server statico, ad esempio:

```bash
python3 -m http.server 8000
```
