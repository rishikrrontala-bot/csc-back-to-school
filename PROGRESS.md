# PROGRESS: CSC Back-to-School Hackathon

Running log for the unattended cloud build. A resumed session starts here.

**Deadline:** Mon Oct 5, 2026 · 3:00 AM EDT (`2026-10-05T03:00:00-04:00`)
**Internal ship-by (all deliverables done, ≥24 h early):** Sun Oct 4, 2026 · 3:00 AM EDT
**Branch:** `claude/hackathon-project-complete-uxiwp0` → finish on `main`
**Live URL:** https://rishikrrontala-bot.github.io/csc-back-to-school/

## Countdown log

| Phase start (ET) | Hours to deadline | Phase |
|---|---|---|
| Wed Sep 23 2026 · 10:38 PM EDT | 268.4 h | 0: setup, PROGRESS.md, tool check |
| Wed Sep 23 2026 · 10:40 PM EDT | 268.3 h | 1–3: research, concepts, pick |
| Wed Sep 23 2026 · 10:52 PM EDT | 268.1 h | 4: design direction |
| Wed Sep 23 2026 · 10:56 PM EDT | 268.1 h | 5: build (engine first) |

## Phase plan (budgeted backwards, hackathon-win Phase 4 table)

268 h remain, far more than the 48 h threshold, so research runs at full depth. The work itself is done in this session; the budget below is the share of the working time, with the hard ship-by 24 h before the deadline.

| Slice | Share | What it covers |
|---|---|---|
| Research + concept | pre-build | Phases 0–3: verify HACKATHON.md, 5–8 winner briefs, RESEARCH-BRIEF, 3 scored concepts, CONCEPT.md |
| Core build | ~50% | Design direction (PRODUCT.md, DESIGN.md), wow moment end-to-end, judge demo path, the rest; Vitest + Playwright + CI + Pages |
| Demo video | ~20% | Script, Playwright capture, captions, H.264 1080p, 1:00–2:00 |
| Submission kit | ~15% | README, docs/, DEVPOST.md, AI-USE.md, gallery, checklist, HANDOFF |
| Buffer | ~15% | Quality passes (critique → audit → polish), live-URL verification, merge to main |

## Tool check (Phase 1)

| Tool | Status |
|---|---|
| Node | v22.22.2, npm 10.9.7 |
| Playwright Chromium | `/opt/pw-browsers/chromium-1194` (preinstalled, do not `playwright install`) |
| ffmpeg | Playwright's ffmpeg is VP8-only; full ffmpeg 7.0.2 via `pip install imageio-ffmpeg` (libx264, aac, libass `subtitles` filter) at `/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2` |
| n8n API | `N8N_BASE_URL` is **unset** in this environment, so there is no API access. Any workflow ships as an importable `n8n/*.json` and the site must work without it. |
| Skills loaded in session | `hackathon-win`, `dataviz`, `anthropic-skills:ui-demo`, `anthropic-skills:make-interfaces-feel-better`, `anthropic-skills:accessibility`, `anthropic-skills:the-humanizer` |
| Network | **Restricted, not Full.** Reachable: GitHub (git clone of public repos; the REST API only for this repo), registry.npmjs.org, PyPI, fonts.googleapis.com / fonts.gstatic.com, storage.googleapis.com. **Blocked** (curl and WebFetch): devpost.com + *.devpost.com, rishikrrontala-bot.github.io, huggingface.co, cdn.jsdelivr.net, unpkg.com, youtube.com, wikipedia.org, web.archive.org, reddit, medium, dev.to, the GitHub search API. WebSearch (server-side) works. So: (1) event facts are cross-checked through WebSearch; (2) winners are verified through official sources read by WebSearch plus cloned repos; (3) the live Pages URL is verified through the GitHub API (Actions run + Pages status) and by serving `dist/` locally under the same base path. |
| Skills missing, used via Fallbacks | `impeccable`, `emil-design-skills:animate` (+ `emil-design-eng`), taste-skill, `hypersite`: cloned to `/tmp/skills/{impeccable,emil-skills,taste-skill}` and read from their `SKILL.md` files. `hypersite` has no public source in the fallback list; its landing-surface role is covered by taste-skill `high-end-visual-design` material + impeccable. |

## Phase log

### Phase 0: setup (Wed Sep 23 · 10:38 PM EDT · 268.4 h left)
- Read CLAUDE.md, HACKATHON.md, PROMPT.md, hackathon-win SKILL.md + references + templates.
- Created this file.

### Phases 1–3: research + concept (Wed Sep 23 · 10:40 → 10:51 PM EDT · 268.2 h left)
- Devpost is blocked by the egress policy, so research went through WebSearch plus cloned repos (see RESEARCH-BRIEF › limits).
- Organiser is most likely the **Webb Schools CS Club** (ushackathons listing: Sep 4 to Oct 5, 2026, online, HS); first edition. HACKATHON.md › Verification added.
- Competitors found and read: **PACE** (workload planner, Next.js + Appwrite), plus two beginner repos.
- 7 winner briefs (5 from the Congressional App Challenge 2025 district winners, 2 from DualHacks 2023, age-flagged) → `research/winners/`. `research/RESEARCH-BRIEF.md` written.
- `scripts/siblings.sh`: only practicetocreate has claimed a concept (**Low Sun**, a commute glare calendar). No overlap.
- 3 concepts scored (`research/CONCEPTS.md`): **A Between Bells 4.40** · B Syllabus X-ray 4.00 · C Fair Seats 3.80. **Picked A.** `CONCEPT.md` pushed.

### Phase 4: design direction (Wed Sep 23 · 10:52 → 10:56 PM EDT · 268.1 h left)
- impeccable (fallback clone) `context` → no PRODUCT.md → init. Rishik is unavailable (stated in the brief), so the interview was replaced by the explicit brief; inferences are labelled in `PRODUCT.md`.
- Direction roll: `impeccable concept-seed --scope direction --mode operate` ran **degraded** (impeccable.style is blocked, so there were no challengers or quality boards) and assigned index 5 of the grounded list: **the transit line diagram** (seed `6f18a518`). Raises from the evacuation plan, the construction drawing and the ADA plaque are recorded in `DESIGN.md`.
- `DESIGN.md` (pre-build tokens: Overpass / Atkinson Hyperlegible Next + Mono, a full palette of 7 line colours + alert red, a motion grammar) and the surface brief `.impeccable/surfaces/index-html.md` (direction contract) written. Code-led (no image generation here).

### Phase 5: build (started Wed Sep 23 · 10:56 PM EDT)
- Scaffold: Vite 8.3, TS 5.9, Vitest 5.0.1, **@playwright/test 1.56.1** (matches the preinstalled chromium-1194), jsdom, @fontsource (Overpass, Atkinson Hyperlegible Next/Mono), lz-string, qrcode-generator. `vite.config.ts` has `base: './'`.
- Engine written and typechecking: `src/engine/types.ts`, `profiles.ts` (cited speed ranges), `route.ts` (graph + Dijkstra on midpoint time, interval sums), `schedule.ts` (transitions, verdicts fits/tight/short, early-release minutes sized on quiet halls, formatting).

## RESUME HERE (for a fresh session)
Next, in order:
1. `src/engine/directions.ts`: turn-by-turn text from route geometry and map labels only (left/right from the cross product; "take Elevator E1 to Floor 2"; "Room 204 is on your left").
2. `src/engine/share.ts`: lz-string encode/decode of {map?, schedule, profile, options} in the URL hash; validate on decode.
3. `src/data/sample-school.ts`: synthetic "Northgate High (sample)", 2 floors + gym annex via ramp, West/East/Center stairs, one elevator E1; a sample schedule where walking fits everything and crutches makes about 2 transitions short.
4. `tests/*.test.ts`: Vitest for profiles/route/schedule/directions/share/sample.
5. UI (`src/main.ts`, `src/ui/*`, `src/styles.css`, `index.html`) per DESIGN.md: plan SVG (true scale, both floors), departure board, mode selector, Play my day (WAAPI dot + stroke draw), Pass (accommodation summary, print CSS), directions strip, Trace editor (image upload, orthogonal-snap corridors, rooms, stairs/elevator, scale from a known length), Share link + QR.
6. e2e (`e2e/*.spec.ts`), CI workflow `.github/workflows/ci.yml`, deploy check through the GitHub API (the Pages URL is blocked from this VM).
7. Then quality passes, video, submission kit, docs, merge to main, HANDOFF.md (see CLAUDE.md › Definition of done).
