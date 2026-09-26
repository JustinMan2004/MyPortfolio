# Portfolio — Minor Futureproof met AI (Justin Man)

Portfoliowebsite met 8 sprints, stories (RS/US/LS), bewijsstukken, leeruitkomsten, feedback, zelfevaluatie en reflectie.

## Lokaal starten

```bash
npm install
npm run dev        # http://localhost:3000
```

## Inhoud aanpassen

Alle inhoud staat in **`src/data/portfolio.json`**. Je kunt dit bestand direct bewerken, of de website zelf gebruiken:

1. Ga naar **Beheer** (link onderaan iedere pagina) en zet de beheermodus aan.
2. Pas sprintstatus, sprints, stories, bewijs, tools en "Over mij" aan via de potlood-/plusknoppen.
   Wijzigingen worden eerst alleen in je eigen browser bewaard.
3. Klik in Beheer op **Download portfolio.json**, vervang `src/data/portfolio.json` door dat bestand,
   en commit + push. Na de nieuwe deploy ziet iedereen de wijzigingen.

### Bewijsbestanden

- **Link** (OneDrive, website, externe URL): plak de link bij het bewijsstuk.
- **Klein bestand (≤ 1 MB)**: kies het bestand in het formulier; het wordt in `portfolio.json` opgeslagen.
- **Groot bestand**: zet het in `public/bewijs/sprint-X/` en gebruik als link `/bewijs/sprint-X/bestandsnaam`.

## Structuur

- `src/data/portfolio.json` — inhoud (profiel, sprints, stories, bewijs, tools)
- `src/lib/constants.ts` — leeruitkomsten, normen, labels
- `src/pages/` — pagina's (Home, Sprints, Sprint, Stories, Leeruitkomsten, Bewijs, AI-tools, Over mij, Beheer)
- `src/components/` — herbruikbare onderdelen en formulieren

## Productie

`npm run build && npm start` — wordt zo ook gebruikt door `render.yaml`.
