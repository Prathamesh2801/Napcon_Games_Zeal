# NAPCON Games — touchscreen kiosk

One drag-and-drop matching game (lungs) for a NAPCON (pulmonology conference) booth, running full-screen
on a **1080-wide portrait touchscreen**. Flow: Tap to start (only once per page load, unlocks sound) → Idle (`/`, `media/idle/idle.mp4` loops with sound, tap → Register) → Register (Slide 1) → Intro (Slide 2, "Start the challenge") → Play (Slide 3; time up = Try again modal)
→ completed → Break (Slide 4: chain breaks, lungs turn healthy, pack rises from the stand and flies into place) → Finale (Slide 6 product page,
Play again / auto after `finale.seconds`). Slide 5 is not used.
→ Idle. Every "home" (finale timer, idle timeouts, Home buttons) goes to `/` = IdlePage, whose tap opens `/register/<first game in config.games>` (or `/intro/…` / `/play/…` if registration / intro is off). `idle.enabled: false` in content.js = `/` redirects straight there.

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

- **`public/config.js`** (→ `dist/config.js`, edit on the kiosk + refresh) only holds `registerUrl` and `timings`
  (seconds): `registerIdleSeconds`, `introIdleSeconds`, `gameSeconds` (timer), `completeSeconds` (auto-submit after a full
  board), `timeUpHomeSeconds` (Try again modal → idle), `finaleSeconds` (Slide 6 → idle video, default 15),
  `arrowSecondsPerTurn` (cycle arrows on all pages). Missing/invalid values fall back to the defaults.
- **All texts, labels, image/sound paths, colours and stage data are fixed in `src/config/content.js`** (change = rebuild).
  `src/config/config.js` clones it and applies the runtime timings/URL; components read everything via `config`.
- Media live in `public/media/` (→ `dist/media/`), referenced by path strings in `content.js`; don't `import` them in `src/`.
- No scoring, no result screen, no dev Finish button (all removed).

## Backend (registrations)

- `public/api/register.php` (→ `dist/api/register.php`), plain PHP 8.0+, no Composer, runs under XAMPP Apache.
  POST JSON `{ name, phone, game, registeredAt }` → no validation (values trimmed, cut at 200 chars; only `game` must be in
  `GAMES` in register.php) → `{ ok: true, id }` or 400 `{ ok: false, errors }`.
- JSON only (no CSV): one file per game, `api/data/<game>-registrations.json`, rewritten on each save; ids count per game.
  Writes are serialised with `flock` on `data/.lock`. Fields: id, name, phone, game, registeredAt (client ISO),
  savedAt (server, Asia/Kolkata).
- **Adding a game**: also add its id to `GAMES` in `public/api/register.php`, or its
  registrations are rejected.
- `api/data/.htaccess` = `Require all denied`; data files are gitignored and never in the zip, so redeploying keeps them.
- Frontend `services/api/registration.js`: success needs `{ ok: true }`; 4xx = rejected (logged, dropped); network/5xx/
  non-JSON (e.g. `npm run dev`, which can't run PHP) = kept in localStorage `napcon:pending-registrations` and re-sent
  after the next successful submit. `api.registerUrl` empty = only store locally.
- Test locally: `C:/xampp/php/php.exe -S 127.0.0.1:8099 -t dist` then POST to `/api/register.php`.

## Layout

```
src/
  config/content.js, config.js← fixed content + runtime timings from public/config.js (see Runtime config)
  main.jsx, routes/index.jsx  ← hash router: / (IdlePage), /register/:gameId, /intro/:gameId, /play/:gameId, /break/:gameId, /finale/:gameId
  layouts/KioskLayout.jsx     ← full-screen shell, blocks context menu, background blobs
  pages/                      ← IdlePage (looping video, `/`), RegisterPage (landing), IntroPage (Slide 2), PlayPage, BreakPage (Slide 4),
                                 FinalePage (Slide 6); layer boxes are rem constants measured from the .ai
  components/layout/Screen    ← animated page wrapper (absolute inset-0 flex col)
  components/ui/              ← OnScreenKeyboard (text|numeric layouts)
  features/games/
    index.js                  ← registry { id: { Component, Icon } } — keys MUST match config.games
    hooks/useMatchGame.js     ← shared engine: bank, placed, hover, timer, tryPlace, finish → onFinish({ won })
    utils.js (+ utils.test.js)← shuffle, canPlace
    components/DragToken.jsx  ← draggable card
    lungs/LungsGame.jsx       ← Slide 3 screen on the centred Stage: 5 "Drop here" boxes round the lungs (SLOTS/ARROWS rem boxes),
                                 5 stage cards in the tray (CARD_LEFTS), strict order, no decoys, 25 s, Submit (ChallengeButton, dim until complete)
  features/cycle/             ← shared lungs ring: CycleHero (disc + CycleArrows + lungs + 5 icons, positions per layout),
                                 layouts.js (REGISTER_LAYOUT / INTRO_LAYOUT boxes in rem, parts in % of box),
                                 CycleArrows (one module-level rotation shared by both pages), Portal (cyan reveal → game)
  features/intro/ChallengeButton.jsx ← pink pill, glow pulse, shine sweep, twinkling sparkles
  features/registration/      ← Slide 1.ai register screen:
                                 RegistrationForm (title/fields/button, absolute rem positions from the artboard),
                                 useRegistrationForm (values, keyboard keys; no validation, empty submit allowed)
  services/sound.js           ← play('correct'|'wrong'|'chainBreak'), files + on/off/volume from config.sound
  services/api/registration.js← POST to config.api.registerUrl (api/register.php); failures backed up + retried
  hooks/useIdleRedirect.js    ← go home after N idle seconds, returns seconds left
public/
  config.js                   ← runtime timings + registerUrl (see above)
  api/register.php            ← registration endpoint → api/data/<game>-registrations.json
  media/                      ← register/, intro/, game/ (Slide 1–3 art), break/ (Slide 4 layers), finale/ (Slide 6 split into base + header, pack, arc,
                                 item-N-icon/-text layers; drawn with mix-blend-multiply so their white boxes vanish), sounds/*
docs/                         ← client Slide 1–6.ai + slide-N.png renders (1080 wide); not shipped
```

## How the games work

- **Token → slot**: `token.slot` is one slot id, or an array of ids when identical tokens are interchangeable. `slot: null` = distractor, never fits.
  Lungs: `slot` = 1..N.
- **Drop detection**: `DragToken` uses `document.elementsFromPoint` and finds the nearest element with `data-slot`.
  A slot stops being a target by removing its `data-slot` (filled cells do this).
- `tryPlace` returns `'placed' | 'wrong' | 'none'`; wrong = shake + wrong sound, none = spring back.
- `strictOrder`: only the first unfilled slot in `slotOrder` accepts.
- Finish: complete board (Submit or `completeSeconds`) → `/break` → `/finale`; timer hits 0 → Try again modal.

### Adding a game
1. Add its settings under `games.<id>` in `src/config/content.js` (timeLimit, strictOrder, tokens…).
2. Create `features/games/<id>/<Name>Game.jsx` using `useMatchGame` + `DragToken`, rendering `data-slot` targets.
3. Register it in `features/games/index.js` with an icon. There is no game-selection page any more: `/` goes to the first game in `config.games`, so a second game needs a picker again.
4. Add it to `GAMES` in `public/api/register.php` so its registrations are accepted.

## Conventions

- **Sizing**: designed at 1080px wide, measured in **rem (1rem = 16 design px)**. `html` font-size = min(vw/67.5, vh/120), so the full
  1080×1920 design always fits. Register + intro put their content in `components/layout/Stage` (67.5×120rem, centred both
  ways, no transform); only the background image covers the whole viewport. `html` font-size scales with the
  viewport (`index.css`) — so use rem/Tailwind units, never px, and **never CSS `transform: scale` on the stage**
  (it breaks drag pointer math).
- Never put `transform`/`translate`/`filter`/`z-index` on ancestors of `DragToken` (e.g. TokenBank wrappers): it creates a
  stacking context and the dragged token (zIndex 50 from drag start until it springs home) slides under the art/table.
- Colors only via theme tokens: `paper surface line ink muted brand brand-ink brand-soft accent success danger`, `shadow-card`.
  Palette follows the AB Phylline E brand (`docs/AB PHYLLIN 3PG.pdf`): brand pink `#e82053`, ink `#231f20`.
- Big touch targets (h-20+/h-24 buttons, text-2xl+). No hover-only UI. `touch-none` on draggables.
- Content goes in `src/config/content.js`, timings in `public/config.js`, not in components.
- Style: no semicolons, single quotes, 2-space indent, arrow fns, default-export components.
- **No comments anywhere** (code, config files, CSS, HTML) — user preference. Explain things in this file instead.
- `content.js` cheat sheet: `games.*.timeLimit` seconds or null;
  `strictOrder` fill 1→N; `slot: null` = decoy; `ring` = % of art (x, y centre, size = diameter of width);
  `break { media, button, labels[5][lines] }` (Slide 4), `finale { media, seconds, button }` (Slide 6); `intro` = Slide 2 page (enabled, brush/cycleIcon/tagline images, title, subtitle, quote, button; hero art reused from `registration.screen`); `registration.screen` = register art (media/register/*), title/subtitle/button text, `arrowSecondsPerTurn`; `registerUrl` empty = don't send (local backup only); in labels a soft hyphen is U+00AD, a non-breaking hyphen is U+2011.
- Registration must never block play: API errors fall back to localStorage key `napcon:pending-registrations` (retried later).
- Keep pure logic in `utils.js` and add a case to `utils.test.js` when it changes.

## Status / open items

_Update this list as work progresses (newest first)._

- **2026-10-30** — Idle screen: `docs/idle.mp4` (1080×1920, 23 s) copied to `public/media/idle/idle.mp4`, looped on `/` by `IdlePage`
  with sound: a "Tap to start" screen (`idle.button`, register background) shows once per page load so the browser allows
  unmuted playback (module-level `unlocked` flag; falls back to muted if play() is refused); tap on the video → register. After the finale, `finaleSeconds` (public/config.js) returns here.

- **2026-10-23** — High-res pack from the client (`docs/AB Phylline E pack 3D_Synapse 20-3-26.zip`, PSD 2459×1367): composited
  with psd-tools without the white `Layer 0` (box + its multiply shading layers) → transparent 1344×1128 cut-out, saved as both
  `media/break/pack.webp` and `media/finale/pack.webp` (same shot, so the Slide 4 → 6 flight lands exactly). New rects:
  BreakPage `PACK` [21.45, 74.48, 24, 20.143] (hidden at y 22rem until the rise), finale `PACK` [18.81, 38.43, 27.72, 23.265],
  `FLIGHT` scale 1.155. The AI-upscaled pack from the previous entry is replaced.

- **2026-10-23** — 4K sharpness on Slide 4: badges split into `badge-N-circle` (ring+dot+icon, shown at `CIRCLE_SCALE` 0.75,
  origin bottom) and `badge-N-pill` (full size, HTML text), both built from Real-ESRGAN x4 upscales of the .ai parts.
  `break/pack.webp` = Real-ESRGAN x4 (1000×652) with the tiny print (10 x 10 Tablets, Tablets, side panel, SUN logo) patched
  back from a plain Lanczos upscale, because the model garbles small text. Finale pack left as is: its upscale distorted the
  brand text. Tools in the scratchpad: `esr.py` (tiled ONNX Real-ESRGAN, Qualcomm x4plus model), `hires.py`.
  Best fix for packs: a high-res pack shot from the client.

- **2026-10-23** — Slide 5 removed (BrokenPage, `/broken`, banner.webp, `brokenSeconds`). Slide 4 sequence on BREAK THE CYCLE:
  charge (chain spins up, sick lungs pulse) → break (shards, rings, flash; sick lungs fade, Slide 5 healthy lungs (`media/break/healthy-lungs.webp`,
  colour-segmented out of Slide 5's flat background, script `lungs5.py` in the scratchpad) grow in at `HEALTHY` with a halo) → rise (pack comes up out of the stand) → out (pack flies `FLIGHT` to the finale pack position over a
  white fade, finale pack crossfades in) → `/finale` with `state.fromBreak` (no page fade, pack already in place, rest animates in).

- **2026-10-23** — Registration validation removed completely (user request): no sanitising, length limits, required checks or
  error pills in the form; `registration.fields` dropped; PHP accepts any name/phone (trim + 200-char cut), only checks `game`.

- **2026-10-23** — Production cleanup: `public/config.js` reduced to `registerUrl` + `timings`; all content moved to
  `src/config/content.js`. Removed scoring (`calcScore`, `scoring`, mistakes counter), `/result` + ResultPage, dev Finish
  button + `solveBoard`, unused GameHud/TokenBank/BrandBar/Button, `splitHalf`/`formatTime`. Registration save re-tested with
  XAMPP PHP: valid → `{ok:true,id}` appended to `api/data/lungs-registrations.json`, invalid → 400.

- **2026-10-23** — `media/break/stand.webp`: the button's pink glow baked into its bottom rows was faded out (now 600×104).
  Slide 4: no pack at the start; BREAK THE CYCLE → stand flashes, light column, pack rises out of the stand (clipped by an
  overflow-hidden wrapper ending at the pack's resting bottom, 94.8rem), landing ring, then charge → chain break as before.

- **2026-10-23** — Slides 4–6 wired after a completed game. `BreakPage` (Slide 4, `media/break/`: chain, lungs (sick), pack, stand,
  badge-1..5 = ring+dot+icon+pill composited, label text is HTML from `break.labels`): chain fades in and turns slowly, badges pop
  in, pack rises from below onto the stand; BREAK THE CYCLE (ChallengeButton `lead` icon) → pack dips and surges up with a beam,
  chain spins up, then shatters into 10 clip-path wedges (chainBreak sound), badges fly out, lungs turn healthy, cyan flash →
  `BrokenPage` (Slide 5 rebuilt from parts: banner.webp slam + burst, healthy register lungs, 6 `CycleArrows`, stand, pack; no
  button; `broken.seconds` 10) → white fade → Finale. Game → break portal is now `night`. Finale benefit layers re-cut with
  per-shape masks (shadows were clipped and an arc dot leaked into item 2; script `finale_split2.py` in the scratchpad); home
  icon replaced by a Play again button, auto-home `finale.seconds` 15.

- **2026-10-23** — Client resequenced `docs/` into 6 slides (renders `docs/slide-N.png`, 1080 wide): 1 register, 2 intro, 3 game,
  **4 NEW "Break the cycle"** (5 stages round the lungs wrapped in a mucus chain, AB Phylline E pack, BREAK THE CYCLE button),
  **5 NEW "You have broken the cycle!"** (clean lungs + arrows, pack, PLAY AGAIN), 6 = the old white product page (current finale).
  Slide 4's clockwise stage order matches `games.lungs.tokens` slot 1–5. Slides 4–5 not built yet.

- **2026-10-23** — Game lungs breathe faster and slightly see-through (opacity 0.92↔0.72, scale 1↔1.05, 2.4 s). `media/game/stopwatch.webp`
  cropped to its visible outline (crown + face) on a square canvas so it sits centred; modal badge icon 7.4rem, timer panel 3.7rem.

- **2026-10-23** — Game: the 5 static arrow images (removed) replaced by the rotating `CycleArrows` ring (`count` prop = 5) centred on
  the lungs, behind the drop boxes; brighter with each placed stage, spins fast on completion. `games.lungs.arrowSecondsPerTurn`.
  Lungs breathing fixed: opacity only fades in once (the repeat used to loop opacity to 0), loop is scale 1 → 1.045.

- **2026-10-23** — No lose screen any more: time up → `TimeUpModal` (stopwatch badge, placed x/5 dots, Try again = remount the
  round via `key`, Home, auto-home after `timeUp.homeSeconds`). Only a completed cycle reaches `/finale`. FinalePage now animates
  Slide 4: header drops in, pack springs up and floats, dotted arc wipes left→right while the 5 benefits pop in one after
  another (icon spring + text rise), then each icon pulses in turn. Config: `finale { media: folder, seconds }`, `timeUp {…}`.

- **2026-10-23** — Game rebuilt from `docs/Slide 3.ai` (old pink lungs/chain game, chain.webp, finale.svg removed). Cards placed one
  after another in strict order (wrong = card springs back + shake + red slot flash + wrong sound); placement = card pops into the
  box, numbered colour badge, double ripple, the arrow out of that box lights up. Complete → arrows chase-light, lungs glow,
  "Cycle complete!", chainBreak sound, Submit lights up with sparkles; Submit or `completeSeconds` (6) → finale. Time up (25 s) →
  "Time's up!" → finale. Both use `Portal` (paper tone) → `/finale` = `media/finale.webp` (Slide 4 render) on white.
  Intro → game portal uses the `night` tone. Card answer order assumed = the creative's tray order (slot 1–5 in config).

- **2026-10-23** — `docs/` = client `.ai` slides + a 1080-wide reference render of each (`slide-N.png`); PDFs removed.
  Flow: Slide 1 register (done) → Slide 2 intro (done) → **Slide 3 game screen** (blue redesign: 5 numbered "Drop here" boxes
  around the lungs, 5 stage cards with icons, 25 s timer, pink SUBMIT, no decoys — not built yet) → **Slide 4 AB Phylline E
  product page** (white; likely the finale image). Waiting for the user's next instructions.

- **2026-10-23** — Register/intro were left-aligned and cropped at the bottom on non-9:16 screens: rem now based on 120rem height
  (was 112) and both pages render inside the centred `Stage`; keyboard is stage-width and centred.

- **2026-10-23** — Intro page from `docs/Slide 2.ai` between register and game. Register submit morphs the hero ring straight
  into the intro's ring position (`MORPH_MS`, arrows hand off spinning at `HANDOFF_SPEED` and slow down; icons/lungs slide from
  REGISTER_LAYOUT to INTRO_LAYOUT; intro `Screen animateIn={false}`). "Start the challenge" → hero zooms + `Portal` → `/play`.
  Slide 2's clean lungs (no arrows) now used on both pages (`media/register/lungs.webp`); text is HTML in Arial bold,
  "Break the cycle and go beyond" is an image (`media/intro/tagline.webp`). "Challenge"/quote gradients sampled from the render.

- **2026-10-23** — Register page rebuilt from `docs/Slide 1.ai` (blue creative, supersedes GAME 1.ai). Assets extracted with
  PyMuPDF + OpenCV into `public/media/register/`: arrows were baked into the lungs and disc, so they were inpainted out and
  redrawn as a rotating SVG (`CycleArrows`); top cough icon split out as `icon-0`. Keyboard (glass, `OnScreenKeyboard`) is hidden
  until a field is tapped; then hero shrinks and form moves up (`openLayout()` in RegisterPage). Submit: form fades, arrows spin
  up, hero zooms to centre, cyan rings + circular reveal (`Portal`), then `/play`. Font: `@fontsource/source-sans-3` (Myriad-like, offline).
  Errors = red pill on the label row. Higher-res lungs/background from the designer would look sharper.

- **2026-10-22** — Client sent `docs/GAME 1.ai` (Illustrator, PDF-compatible: open with PyMuPDF `fitz.open(path, filetype='pdf')`).
  3 artboards 900×1600 for the register page: light (white + pink/peach corner shapes, Sun Pharma | No.1 logo top centre, orange-
  bordered fields, peach START GAME), dark (lungs bg `dark-bg-lungs-image.png` under a `#231f20` overlay, white text), bg only.
  Myriad Pro; orange accents `#f05a28 #f7931c #fcd1b0`. **Waiting for creatives to confirm** light vs dark + palette before implementing.
- **2026-10-22** — Brand palette (pink `#e82053` from the AB Phylline E PDF) replaces teal. `BrandBar` with two logo slots
  (Sun Pharma left, AB Phylline E right) on register + game HUD; `app.logo` → `app.logos { left, right }`. Finale placeholder recoloured.
- **2026-10-22** — Registrations saved as JSON only (CSV + readable game name dropped). Tested with XAMPP PHP.
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
- TODO: logo files from the client (.ai or images): Sun Pharma → `app.logos.left`, AB Phylline E (~6.4:1) → `app.logos.right`, files in `public/media/`.
