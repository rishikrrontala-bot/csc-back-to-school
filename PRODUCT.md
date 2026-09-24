# Product

<!-- impeccable:product-schema 1 -->

> **How this was captured.** Rishik (the builder) is unavailable for this unattended cloud run and said so directly in the brief, so impeccable's interview round was not held. Every fact below comes from the explicit brief (`CLAUDE.md`, `HACKATHON.md`, `CONCEPT.md`, `research/`). Inferences are marked *(inferred)*.

## Platform

web

## Stack
Delegated: Vite + TypeScript, no UI framework; SVG for the plan and the route animation; a pure-function engine (`src/engine/`) tested with Vitest; Playwright e2e; GitHub Pages with `base: './'`. Chosen because CLAUDE.md sets static-first / Vite + TS as the default, and the product is one interactive tool where a framework adds weight without adding capability.

## Users
- **Primary:** a US high-school student whose way of moving makes the standard passing period unreliable: on crutches after an injury, a wheelchair user, a student with a heart or joint condition, a student with low vision using a cane. They're checking *before* the first week (or right after an injury) whether each transition in their schedule is doable, and they need something concrete to bring to the adult who can change it. *(persona, not a real user)*
- **Secondary:** the school's 504 / accommodations coordinator or counselor who reads the summary; any new student (freshman, transfer) in week one who just needs to find Room 214; a student volunteer or club (such as a CS club) who traces the school once and shares the link. *(personas)*
- **Evaluator:** hackathon judges, most likely high-school CS club officers (RESEARCH-BRIEF). They'll open it cold, on a laptop or phone, with no account.

## Product Purpose
Between Bells answers one question per transition: *can this student, moving the way they move, get from this room to the next one before the bell?* It returns an honest time range per transition and the route that achieves it, marks the transitions that don't fit and why, and turns the result into a precise, plain-language accommodation summary. Success: a student walks into their 504 meeting with "Periods 2→3 and 5→6 need 3 minutes of early release and the elevator" instead of "I need extra time".

## Positioning
The only tool that times *a student's own bell schedule* per mobility profile, reports ranges instead of fake-precise minutes, and outputs an accommodation request, on maps that a student can trace from the evacuation plan posted inside the classroom door and share as a link, with no server and no account. Enterprise wayfinding (Mappedin, Concept3D, Mapsted) routes accessibly for paying campuses but knows nothing about bells or accommodations.

## Operating Context
- School buildings with multiple floors, stairwells, one or two elevators (often key-operated), long corridors, portables or separate buildings.
- Bell schedules with passing periods of roughly 3–10 minutes; five is the most common in the US (Minga's passing-period explainer). Sample school uses 5.
- Fire code for educational occupancies requires an evacuation plan posted inside the main exit door of each room (Indiana DHS, *Fire Code Awareness in Schools*): the source map for tracing.
- The 504 process: accommodations like "leave class early to avoid hallway congestion" exist for students with mobility devices (DoDEA Section 504 examples), but they're usually written without numbers.
- Used on a phone in a hallway or on a laptop at home; used again when a schedule or an injury changes.

## Capabilities and Constraints
- Route engine: Dijkstra over a time-weighted, multi-floor graph (rooms, corridor nodes, doors, stairs, elevators, ramps); profile-dependent edge costs and availability; outputs a [min, max] time interval from cited speed ranges.
- Sample school (synthetic, labelled as such) with two floors plus an annex; a schedule editor; mobility profiles (walking, crutches, manual wheelchair, custom); options for stops (locker, restroom) and crowd level.
- Day playback animation; per-transition verdicts (fits / tight / short); accommodation summary (print-ready); text directions derived only from map labels.
- Trace editor over an uploaded image or the sample plan; scale from one known length; share link with the map and schedule encoded in the URL hash; JSON import/export.
- **Static only.** No backend, no key, no analytics. Disability-related data never leaves the device.
- **Not** a medical, legal or 504 determination; not real-time indoor positioning; walking times are estimates.

## Brand Commitments
- Name: **Between Bells**. Tagline: *Every passing period, timed for the way you move.*
- Visible credit "Built by Rishik Rontala" and `<meta name="author" content="Rishik Rontala">` (CLAUDE.md).
- Its own art direction, not shared with Rishik's 14 other entries; banned: purple/blue gradients, centered-card SaaS templates, emoji section headers, Playfair + drop shadows, generic 3D blobs, stock hero illustrations (CLAUDE.md).
- Voice: plain, direct, respectful about disability (person-first where natural, never pitying); numbers always as ranges with their sources one click away. *(inferred from CLAUDE.md's "documented restraint" rule)*

## Evidence on Hand
- Cited speed ranges: Weidmann free walking speed 1.34 m/s; Fruin stair speeds (0.59–0.88 m/s along the stair, male/female, up/down); 3-point axillary crutch gait ≈0.5 m/s (Malaysian Orthopaedic Journal, 2021); swing-through crutch gait up to 1.2 m/s in practised healthy adults; manual wheelchair self-selected ≈1.27 m/s (lab). Sources live in `docs/SOURCES.md`.
- **Absent, never to be fabricated:** real users, testimonials, a real school's map, usage numbers, accuracy validation against timed real-world walks. The sample school is synthetic and labelled.

## Product Principles
1. **Time is the product; the map is how we compute it.** Every screen answers "will I make it?" before it shows anything else.
2. **Honest ranges, never fake precision.** Every estimate is an interval with its assumptions visible and editable.
3. **Nothing is invented.** Directions use only labels from the map; the product contains no generative AI because a model that invents a hallway is worse than no directions.
4. **Private by construction.** Mobility and disability information stays on the device; sharing is an explicit link the student chooses to send.
5. **One sitting to add a school.** Tracing must be fast enough that one volunteer can do it for everyone.

## Accessibility & Inclusion
WCAG 2.2 AA is a floor, not a feature: this product serves disabled students. Full keyboard operation (including the trace editor's core actions), visible focus, screen-reader-first text directions, `prefers-reduced-motion` honoured (the day playback becomes a stepped sequence), contrast ≥ 4.5:1 for text, no information conveyed by colour alone (verdicts carry words and icons), and a usable layout at 375 px.
