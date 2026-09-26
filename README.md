# Portfolio Justin Man – minor Futureproof met AI

Mijn bewijsportfolio voor de minor **Futureproof met AI** (Commerciële Economie, HAN).
Een statische React-website (Vite + Tailwind). Er is geen database, geen login en er zijn geen API-keys nodig.
**Alle content staat in `src/content/`.** Componenten hoef je niet aan te passen.

## Snel starten

```bash
npm install      # eenmalig
npm run dev      # lokaal bekijken op http://localhost:5173
npm run build    # productieversie bouwen (map dist/)
npm start        # gebouwde versie draaien op http://localhost:3000
```

## Waar staat wat?

| Wat wil je aanpassen?                         | Bestand                                      |
| --------------------------------------------- | -------------------------------------------- |
| Naam, intro, "Over mij", "Waarom deze minor?" | `src/content/profile.ts`                     |
| Profielfoto                                   | `public/images/` + `photo` in `profile.ts`   |
| Leeruitkomsten: niveau en argumentatie        | `src/content/learningOutcomes.ts`            |
| Een sprint (stories, bewijs, feedback, …)     | `src/content/sprints/sprint-1.ts` t/m `sprint-8.ts` |
| Bestanden (PDF, Word, Excel, afbeeldingen)    | `public/bewijs/sprint-X/`                    |
| Kleuren en lettertype                         | `src/index.css` (blok `@theme`)              |
| Labels van niveaus en bewijstypes             | `src/lib/labels.ts`                          |

**Placeholders:** tekst tussen `[vierkante haken]` wordt op de site geel gemarkeerd.
Zoek in VS Code op `[Invullen` (Ctrl/Cmd + Shift + F) om alles te vinden wat je nog moet invullen.

## Een sprint vullen

Open `src/content/sprints/sprint-2.ts` (enz.). Kopieer de opbouw uit `sprint-1.ts` en pas het volgende aan:

- `status`: `'gepland'`, `'bezig'` of `'afgerond'`
- `title`, `period`, `summary`, `overview`, `topics`
- `stories`, `evidence`, `feedback`, `selfEvaluation` en `reflection`

Een extra sprint (bijvoorbeeld 9) voeg je toe door `sprint-9.ts` aan te maken en die op te nemen in `src/content/sprints/index.ts`.

## Een story toevoegen

Voeg in de `stories`-lijst van de sprint een blok toe:

```ts
{
  id: 's2-us1',                 // uniek, gebruik je om bewijs te koppelen
  type: 'US',                   // 'US' | 'RS' | 'LS'
  title: '...',
  description: 'Als ... wil ik ... zodat ...',
  context: '...',
  approach: ['stap 1', 'stap 2'],
  result: ['...'],
  acceptanceCriteria: ['...'],
  qualityCriteria: ['...'],
  learningOutcomes: ['LU2', 'LU4'],
  status: 'afgerond',
},
```

## Een bewijsstuk toevoegen

Voeg in de `evidence`-lijst van de sprint een blok toe:

```ts
{
  id: 's2-b1',                                  // uniek
  title: 'Onderzoeksrapport klantonderzoek',
  description: 'Korte omschrijving.',
  type: 'pdf',                                  // pdf | document | excel | afbeelding | screenshot | video
                                                // github | website | link | tekst | presentatie
  storyId: 's2-rs1',                            // → "Hoort bij: [Story]"
  learningOutcomes: ['LU1', 'LU3'],             // → "Toont aan: [LU]"
  date: '2026-10-05',
  aiTools: ['ChatGPT', 'Perplexity'],
  url: 'bewijs/sprint-2/rapport.pdf',           // bestand in public/ of een https://-link
  thumbnail: 'bewijs/sprint-2/rapport.png',     // optioneel: voorbeeldafbeelding
  text: 'Optioneel: tekstbewijs dat direct op de site staat',
  featured: true,                               // optioneel: tonen op de homepage
},
```

Het bewijs verschijnt daarna automatisch op de sprintpagina, bij de story, op de pagina van iedere gekoppelde leeruitkomst en op de pagina Bewijs.

- **Kleine bestanden** (PDF, Word, Excel, PowerPoint, afbeeldingen): zet ze in `public/bewijs/sprint-X/` en gebruik als `url` `'bewijs/sprint-X/bestandsnaam.pdf'`. Gebruik bij voorkeur bestandsnamen zonder spaties.
  Bij Word, Excel en PowerPoint toont de site de knop **"Download bewijs"**, bij de andere types **"Bekijk bewijs"**.
- **Grote bestanden en video's**: upload ze naar OneDrive, Google Drive of YouTube en gebruik de deellink als `url`.
- Bewijs zonder `url` wordt getoond als **"Bewijs volgt nog"**.

## Publiceren

- **Render** (al ingesteld via `render.yaml`): push naar GitHub, dan bouwt Render automatisch opnieuw.
- **Netlify, Vercel of Cloudflare Pages**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: werkt ook, omdat de site relatieve paden en hash-links (`#/sprints/1`) gebruikt.
