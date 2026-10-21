# NAPCON Games — touchscreen kiosk

Two drag-and-drop matching games for a NAPCON (pulmonology conference) booth, running full-screen
on a **1080-wide portrait touchscreen**. Flow: Home → (optional) Register → Play → Result → auto back to Home.

> Keep this file current. When something changes, update the relevant section and the **Status** log at the bottom.

## Stack

- React 19 + Vite 8, plain JS/JSX (no TypeScript, no ESLint/Prettier configured)
- Tailwind CSS 4 via `@tailwindcss/vite` — theme tokens live in `src/index.css` `@theme` (no tailwind.config)
- framer-motion (animations + drag), react-icons (`fa6` set), react-router 8 (`createHashRouter`)
- Tests: Node's built-in `node:test` — no Jest/Vitest

## Commands

```
npm run dev      # vite --host (reachable from the kiosk on LAN)
npm run build    # → dist/, base './' so it runs from any XAMPP htdocs subfolder
npm run preview
npm test         # node --test "src/**/*.test.js"
```

Git: `main` → `origin` https://github.com/Prathamesh2801/Napcon_Games_Zeal.git. `dist/` and `node_modules/` are gitignored;
`dist/` is the deployable output (run `npm run build`, copy into XAMPP `htdocs/<folder>`).

## Layout

```
src/
  config/config.js            ← SINGLE place for all content/tuning (texts, timers, scoring, game data, API url)
  main.jsx, routes/index.jsx  ← hash router: /, /register/:gameId, /play/:gameId, /result
  layouts/KioskLayout.jsx     ← full-screen shell, blocks context menu, background blobs
  pages/                      ← HomePage, RegisterPage, PlayPage, ResultPage (thin; data via route state)
  components/layout/Screen    ← animated page wrapper (absolute inset-0 flex col)
  components/ui/              ← Button (primary|ghost), OnScreenKeyboard (text|numeric layouts)
  features/games/
    index.js                  ← registry { id: { Component, Icon } } — keys MUST match config.games
    hooks/useMatchGame.js     ← shared engine: bank, placed, mistakes, hover, timer, tryPlace, finish
    utils.js (+ utils.test.js)← shuffle, splitHalf, canPlace, calcScore, formatTime
    components/               ← DragToken, TokenBank, GameHud
    lungs/LungsGame.jsx       ← 5 symptoms onto a ring of slots over lungs art (strict order 1→5)
    table/TableGame.jsx       ← SITT half-life table: static header row + first column, 16 value tokens into cells
  features/registration/RegistrationForm.jsx  ← name + phone, on-screen keyboard, validation
  services/api/registration.js← POST to config.api.registerUrl; on failure → localStorage backup
  hooks/useIdleRedirect.js    ← go home after N idle seconds, returns seconds left
  assets/images/lungs-placeholder.svg  ← placeholder art, to be replaced with the real asset
docs/2_label_game.jpeg        ← client reference for the table game (see Status)
```

## How the games work

- **Token → slot**: `token.slot` is one slot id, or an array of ids when identical tokens are interchangeable. `slot: null` = distractor, never fits.
  Lungs: `slot` = 1..N. Table: tokens are generated from `config.games.table.cells[row][col]` (slot id `"row-col"`);
  a token fits every cell with the same text (e.g. the four `~33–57 hrs³`). Row labels use non-breaking hyphens (`‑`, U+2011).
  Besvil column = `highlight: true` (cream column, bold values, blue gradient badge when "Aligned" lands). Assessment text colours come from `tones`.
- **Drop detection**: `DragToken` uses `document.elementsFromPoint` and finds the nearest element with `data-slot`.
  A slot stops being a target by removing its `data-slot` (filled cells do this).
- `tryPlace` returns `'placed' | 'wrong' | 'none'`; wrong = shake + mistake++, none = spring back.
- `strictOrder`: only the first unfilled slot in `slotOrder` accepts.
- Finish: complete board (after an animation / `timing.completionDelayMs`) or timer hits 0 → `onFinish(result)` →
  `/result` with `{ won, score, correct, total, mistakes, timeLeft, player, gameId }` in route state.
- Score = `correct*pointsPerCorrect − mistakes*penaltyPerMistake + timeLeft*timeBonusPerSecond`, floored at 0.

### Adding a game
1. Add its settings under `config.games.<id>` (title, description, timeLimit, strictOrder, tokens…).
2. Create `features/games/<id>/<Name>Game.jsx` using `useMatchGame` + `GameHud` + `TokenBank`, rendering `data-slot` targets.
3. Register it in `features/games/index.js` with an icon. Home lists games from `config.games` automatically.

## Conventions

- **Sizing**: designed at 1080px wide, measured in **rem (1rem = 16 design px)**. `html` font-size scales with the
  viewport (`index.css`) — so use rem/Tailwind units, never px, and **never CSS `transform: scale` on the stage**
  (it breaks drag pointer math).
- Colors only via theme tokens: `paper surface line ink muted brand brand-ink brand-soft accent success danger`, `shadow-card`.
- Big touch targets (h-20+/h-24 buttons, text-2xl+). No hover-only UI. `touch-none` on draggables.
- Content/tuning goes in `config.js`, not in components. Rebuild after config changes.
- Style: no semicolons, single quotes, 2-space indent, arrow fns, default-export components, minimal comments.
- Registration must never block play: API errors fall back to localStorage key `napcon:pending-registrations`.
- Keep pure logic in `utils.js` and add a case to `utils.test.js` when it changes.

## Status / open items

_Update this list as work progresses (newest first)._

- **2026-10-21** — TokenBank is now a grid (`columns` prop, default one row); table game uses `columns={4}` → 2×4 per band, uniform `w-56` cards, small x/y/tilt jitter.
- **2026-10-21** — Right/wrong drop sounds (`src/assets/sounds/correct.wav`, `wrong.mp3`) played from `useMatchGame.tryPlace`; `config.sound.enabled/volume`.
- **2026-10-21** — Game 2 rebuilt as the SITT half-life table from `docs/2_label_game.jpeg` (config-driven `cells`), place animation
  (spring pop + success ripple), TokenBank spreads tokens across the whole band (`content-evenly` + x/y jitter). Visual check: headless
  Chrome `--screenshot` at 540×960 @2x works when the browser extension isn't connected.
- **2026-10-21** — Double-tap fullscreen toggle in `KioskLayout` (ignores button/input/`.touch-none`), switch `config.app.doubleTapFullscreen`.
- **2026-10-21** — Register screen scaled up (bigger heading/fields/button, keys h-32, form vertically centred). Total ≈ 103rem, keep it under the 112rem budget in `index.css`.
- **2026-10-21** — Baseline analysed: both games, registration, result screen working; 3/3 tests pass.
- TODO: Lungs art is a placeholder SVG (`lungs-placeholder.svg`); swap for the real artwork and retune `games.lungs.ring` (x/y/size %).
- TODO: Besvil-G header is styled text; drop the real logo in `src/assets/images/` and set `image` on that column.
  (The earlier reference also had a 5th column FLU-F + VIL + UME / Near-aligned profile — current `docs/2_label_game.jpeg` has 4.)
- TODO: `config.api.registerUrl` is empty → registrations are not sent anywhere yet (and not backed up either, since the early return skips storage).
