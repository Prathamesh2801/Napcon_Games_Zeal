# NAPCON Games — touchscreen kiosk

One drag-and-drop matching game (lungs) for a NAPCON (pulmonology conference) booth, running full-screen
on a **1080-wide portrait touchscreen**. Flow: Register (landing page) → Play → Finale image (same image whether completed or time ran out)
→ auto back to Register. `/` redirects to `/register/<first game in config.games>` (or `/play/…` if registration is off).

> Keep this file current. When something changes, update the relevant section and the **Status** log at the bottom.

## Stack

- React 19 + Vite 8, plain JS/JSX (no TypeScript, no ESLint/Prettier configured)
- Tailwind CSS 4 via `@tailwindcss/vite` — theme tokens live in `src/index.css` `@theme` (no tailwind.config)
- framer-motion (animations + drag), react-icons (`fa6` set), react-router 8 (`createHashRouter`)
- Tests: Node's built-in `node:test` — no Jest/Vitest

## Commands

```
npm run dev      # vite --host (reachable from the kiosk on LAN)
npm run build    # → dist/ (base './', runs from any XAMPP htdocs subfolder), then postbuild zips it → napcon-games.zip
npm run preview
npm test         # node --test "src/**/*.test.js"
```

Git: `main` → `origin` https://github.com/Prathamesh2801/Napcon_Games_Zeal.git. `dist/`, `node_modules/`, `*.zip` are gitignored.
Deploy: unzip `napcon-games.zip` into XAMPP `htdocs/<folder>`.

## Runtime config (no rebuild)

- **All settings + content live in `public/config.js`** (→ `dist/config.js`): a classic script setting `window.NAPCON_CONFIG`,
  loaded by `index.html` before the app. `src/config/config.js` just re-exports it. Edit `dist/config.js` on the kiosk + refresh.
- **All media live in `public/media/`** (→ `dist/media/`) and are referenced by relative path strings in config
  (art, chain, finale images, sound files). Replace a file or point the config at a new one — no rebuild.
- Don't `import` images/sounds in `src/`; anything content-like belongs in `public/`.
- `devMode: true` → orange **Finish** button in the game HUD that solves the board (`solveBoard`) so the completion
  animation + finale can be checked fast. Keep it `false` for the event.

## Backend (registrations)

- `public/api/register.php` (→ `dist/api/register.php`), plain PHP 8.0+, no Composer, runs under XAMPP Apache.
  POST JSON `{ name, phone, game, registeredAt }` → validates (name letters/space/.'- ≤60, phone empty or 10 digits,
  game must be a key of `GAMES` in register.php) → `{ ok: true, id }` or 400 `{ ok: false, errors }`.
- One pair of files per game in `api/data/`: `<game>-registrations.json` (source of truth, rewritten) and
  `<game>-registrations.csv` (UTF-8 BOM so Excel shows names right, appended); ids count per game. Writes are serialised
  with `flock` on `data/.lock`. CSV columns: ID, Name, Phone, Game (readable name), Registered At (client ISO),
  Saved At (server, Asia/Kolkata); JSON also keeps the `game` id.
- **Adding a game**: also add it to `GAMES` (`'id' => 'Readable Name'`) in `public/api/register.php`, or its
  registrations are rejected.
- `api/data/.htaccess` = `Require all denied`; data files are gitignored and never in the zip, so redeploying keeps them.
- Frontend `services/api/registration.js`: success needs `{ ok: true }`; 4xx = rejected (logged, dropped); network/5xx/
  non-JSON (e.g. `npm run dev`, which can't run PHP) = kept in localStorage `napcon:pending-registrations` and re-sent
  after the next successful submit. `api.registerUrl` empty = only store locally.
- Test locally: `C:/xampp/php/php.exe -S 127.0.0.1:8099 -t dist` then POST to `/api/register.php`.

## Layout

```
src/
  config/config.js            ← re-exports window.NAPCON_CONFIG (the real settings are in public/config.js)
  main.jsx, routes/index.jsx  ← hash router: / (redirect), /register/:gameId, /play/:gameId, /result, /finale/:gameId
  layouts/KioskLayout.jsx     ← full-screen shell, blocks context menu, background blobs
  pages/                      ← RegisterPage (landing), PlayPage, ResultPage, FinalePage (thin; data via route state)
  components/layout/Screen    ← animated page wrapper (absolute inset-0 flex col)
  components/ui/              ← Button (primary|ghost), OnScreenKeyboard (text|numeric layouts), Logo (config.app.logo or dashed placeholder; register header + game HUD)
  features/games/
    index.js                  ← registry { id: { Component, Icon } } — keys MUST match config.games
    hooks/useMatchGame.js     ← shared engine: bank, placed, mistakes, hover, timer, tryPlace, finish, solve (dev)
    utils.js (+ utils.test.js)← shuffle, splitHalf, canPlace, solveBoard, calcScore, formatTime
    components/               ← DragToken, TokenBank, GameHud
    lungs/LungsGame.jsx       ← 5-step cycle (Inflammation → … → More Mucus Production) onto a chain ring over the lungs art, strict order, 3 decoys
  features/registration/RegistrationForm.jsx  ← name + phone, on-screen keyboard, validation
  services/sound.js           ← play('correct'|'wrong'|'chainBreak'), files + on/off/volume from config.sound
  services/api/registration.js← POST to config.api.registerUrl (api/register.php); failures backed up + retried
  hooks/useIdleRedirect.js    ← go home after N idle seconds, returns seconds left
public/
  config.js                   ← runtime settings/content (see above)
  api/register.php            ← registration endpoint → api/data/<game>-registrations.{json,csv}
  media/                      ← lungs.webp, chain.webp, finale.svg, sounds/*
docs/                         ← client source files (1st_game_lungs/); not shipped
```

## How the games work

- **Token → slot**: `token.slot` is one slot id, or an array of ids when identical tokens are interchangeable. `slot: null` = distractor, never fits.
  Lungs: `slot` = 1..N.
- **Drop detection**: `DragToken` uses `document.elementsFromPoint` and finds the nearest element with `data-slot`.
  A slot stops being a target by removing its `data-slot` (filled cells do this).
- `tryPlace` returns `'placed' | 'wrong' | 'none'`; wrong = shake + mistake++, none = spring back.
- `strictOrder`: only the first unfilled slot in `slotOrder` accepts.
- Finish: complete board (after its animation / `timing.completionDelayMs`) or timer hits 0 → `/finale/:gameId`.
  One `finale: { image, seconds }` per game, shown for both outcomes (image, home button, auto-home after `seconds`).
- `/result` score screen is only a fallback for a game without `finale`. Score = `correct*pointsPerCorrect − mistakes*penaltyPerMistake + timeLeft*timeBonusPerSecond`, floored at 0.

### Adding a game
1. Add its settings under `games.<id>` in `public/config.js` (timeLimit, strictOrder, tokens…).
2. Create `features/games/<id>/<Name>Game.jsx` using `useMatchGame` + `GameHud` + `TokenBank`, rendering `data-slot` targets.
3. Register it in `features/games/index.js` with an icon. There is no game-selection page any more: `/` goes to the first game in `config.games`, so a second game needs a picker again.
4. Add it to `GAMES` in `public/api/register.php` so its registrations are accepted.

## Conventions

- **Sizing**: designed at 1080px wide, measured in **rem (1rem = 16 design px)**. `html` font-size scales with the
  viewport (`index.css`) — so use rem/Tailwind units, never px, and **never CSS `transform: scale` on the stage**
  (it breaks drag pointer math).
- Never put `transform`/`translate`/`filter`/`z-index` on ancestors of `DragToken` (e.g. TokenBank wrappers): it creates a
  stacking context and the dragged token (zIndex 50 from drag start until it springs home) slides under the art/table.
- Colors only via theme tokens: `paper surface line ink muted brand brand-ink brand-soft accent success danger`, `shadow-card`.
- Big touch targets (h-20+/h-24 buttons, text-2xl+). No hover-only UI. `touch-none` on draggables.
- Content/tuning goes in `public/config.js`, not in components.
- Style: no semicolons, single quotes, 2-space indent, arrow fns, default-export components.
- **No comments anywhere** (code, `public/config.js`, CSS, HTML) — user preference. Explain things in this file instead.
- Config cheat sheet (since `public/config.js` has no comments): `devMode` Finish button; `app.logo` image shown on register + game HUD (empty = dashed "Logo" placeholder); games have no visible title; `games.*.timeLimit` seconds or null;
  `strictOrder` fill 1→N; `slot: null` = decoy; `ring` = % of art (x, y centre, size = diameter of width);
  `finale { image, seconds }`; `api.registerUrl` empty = don't send; in labels a soft hyphen is U+00AD, a non-breaking hyphen is U+2011.
- Registration must never block play: API errors fall back to localStorage key `napcon:pending-registrations` (retried later).
- Keep pure logic in `utils.js` and add a case to `utils.test.js` when it changes.

## Status / open items

_Update this list as work progresses (newest first)._

- **2026-10-22** — "Lungs Game" title removed from screens and config (user found it odd). `Logo` placeholder in register header and game HUD until the real logo arrives.
- **2026-10-22** — Table game cancelled and removed (code, config, finale image, docs, PHP `GAMES`). Game-selection Home page removed;
  Register is the landing page (no back button). `config.app.logo` placeholder for the lung game logo.
- **2026-10-21** — Registrations: XLSX dropped; JSON + CSV per game (`lungs-…`, `table-…`), readable Game column,
  unknown games rejected.
- **2026-10-21** — PHP registration backend (`public/api/register.php`) saving JSON + CSV + XLSX, tested with XAMPP PHP 8.0
  incl. 10 parallel requests (unique ids, files consistent). Frontend retries offline backups.
- **2026-10-21** — Time-up also shows the game's finale image: one image per game for both win and time-up
  (user confirmed). Score screen no longer reached while `finale` is set.
- **2026-10-21** — Removed all comments from the project (user request); config meanings documented in Conventions.
- **2026-10-21** — Runtime config: settings moved to `public/config.js`, media to `public/media/` (editable in `dist/` without a
  rebuild). `devMode` Finish button. Table game also ends on a finale image (no score); finale has a home button.
  `npm run build` → postbuild `bestzip napcon-games.zip dist`.
- **2026-10-21** — Finale screen: a won game with `config.games.<id>.finale = { image, seconds }` goes to `/finale/:gameId`
  (full-screen image, then home after `seconds`) instead of `/result`. Lungs uses `finale-placeholder.svg` until the real image arrives.
  Time-up still goes to the score screen; table game still uses the score screen.
- **2026-10-21** — Lungs: final 5-step sequence + 3 decoys (`slot: null`), bigger text (bank `size-56` / 1.65rem, slot 1.5rem, `SLOT_SIZE` 27),
  `chain-break.wav` plays when the chain breaks (its crack is in the first 0.4s). Sounds moved to `services/sound.js`.
- **2026-10-21** — Lungs game uses real art (`lungs.webp`, `chain.webp`, converted from `docs/1st_game_lungs/*.png`). Slots sit on the
  chain (`SLOT_RADIUS` 39 / `SLOT_SIZE` 25). On completion chain + slots rotate, then the chain is swapped for N pie-slice
  `clip-path` copies (`wedge()`) that crack and fly outward with the slots → result. Headless screenshots don't run framer animations.
- **2026-10-21** — TokenBank is now a grid (`columns` prop, default one row); table game uses `columns={4}` → 2×4 per band, uniform `w-56` cards, small x/y/tilt jitter.
- **2026-10-21** — Right/wrong drop sounds (`src/assets/sounds/correct.wav`, `wrong.mp3`) played from `useMatchGame.tryPlace`; `config.sound.enabled/volume`.
- **2026-10-21** — Game 2 rebuilt as the SITT half-life table from `docs/2nd_game_label/2_label_game.jpeg` (config-driven `cells`), place animation
  (spring pop + success ripple), TokenBank spreads tokens across the whole band (`content-evenly` + x/y jitter). Visual check: headless
  Chrome `--screenshot` at 540×960 @2x works when the browser extension isn't connected.
- **2026-10-21** — Double-tap fullscreen toggle in `KioskLayout` (ignores button/input/`.touch-none`), switch `config.app.doubleTapFullscreen`.
- **2026-10-21** — Register screen scaled up (bigger heading/fields/button, keys h-32, form vertically centred). Total ≈ 103rem, keep it under the 112rem budget in `index.css`.
- **2026-10-21** — Baseline analysed: both games, registration, result screen working; 3/3 tests pass.
- TODO: real finale image → `public/media/`, set `games.lungs.finale.image` (placeholder: `media/finale.svg`).
- TODO: game name logo "AB Phylline E" (wide, ~6.4:1; placeholder boxes use that ratio) → `public/media/`, set `app.logo: 'media/…'`.
