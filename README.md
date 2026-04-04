# Istanbul Adventure Angular

Migrazione del frontend originale HTML/CSS/JavaScript a un'app Angular standalone con routing, servizi tipizzati e UX/UI rinnovata.

## Struttura

```text
src/
  app/
    components/
      mission-card.component.ts
      shell-footer.component.ts
      shell-header.component.ts
    models/
      app.models.ts
    pages/
      archive-page.component.ts
      home-page.component.ts
      landing-page.component.ts
      mission-detail-page.component.ts
      quiz-page.component.ts
      result-page.component.ts
      story-page.component.ts
    services/
      legacy-content.service.ts
      mission-catalog.service.ts
      mission-state.service.ts
      quiz-session.service.ts
    app.component.ts
    app.config.ts
    app.routes.ts
  index.html
  main.ts
  styles.scss
```

## Scelte architetturali

- Angular standalone con `provideRouter` per ridurre boilerplate e mantenere il codice scalabile.
- I contenuti legacy restano sorgente dati caricata in build tramite `angular.json`, mentre UI e stato sono riscritti in TypeScript.
- Stato utente persistito in `localStorage` per profilo emerso, missioni salvate e missioni completate.
- Archivio missioni centralizzato in un servizio con ordinamento, filtri e punteggi di priorita'.

## Avvio locale

Usa una versione Node supportata da Angular 21:

- `20.19+`
- `22.12+`

`Node 21.x` non e' supportato dalla CLI Angular 21.

```bash
npm install
npm start
```

App disponibile di default su `http://localhost:4200`.

## Build

```bash
npm run build
```

Output in `dist/istanbul-adventure/browser`.

## Deploy su GitHub Pages

Il repository include il workflow [`deploy-pages.yml`](/Users/valeriopontini/Desktop/TravelGame/IstanbulAdventure/.github/workflows/deploy-pages.yml), che:

1. esegue `npm ci`
2. builda con `npm run build:pages`
3. pubblica `dist/istanbul-adventure/browser` su GitHub Pages
4. genera anche `404.html` per far funzionare il routing Angular su Pages

Per il deploy automatico:

- assicurati che GitHub Pages usi `GitHub Actions` come source
- pusha su `main`

Per una build manuale:

```bash
npm run build:pages
```

Se il nome del repository cambia, aggiorna il `base-href` nello script `build:pages` in [`package.json`](/Users/valeriopontini/Desktop/TravelGame/IstanbulAdventure/package.json).
