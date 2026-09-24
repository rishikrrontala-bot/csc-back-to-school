# DESIGN: Between Bells

> Pre-build visual system, written at the design-direction phase so the build has tokens to obey. Per impeccable's new-work flow, this file is **re-documented from the built world at finish**, where reality wins over this plan.

## World: the step-free line diagram

**Thesis.** A school day, drawn the way transit systems draw journeys. Transit maps already solved the exact communication problem this product has: *which route works for someone who can't use stairs, and how long it takes.* London's step-free guide, the wheelchair roundel at accessible stations, strip maps above train doors, departure boards: these are the grammar of Between Bells. The school building becomes a network; your rooms become stations; each passing period becomes a line; stairs and elevators become interchanges; the bell is the departure time.

**Refused category default.** The campus-navigation app: a grey Google-style basemap, a blue location dot, rounded white cards, a blue primary button. Also refused: the dark "data dashboard" with neon lines.

**Grounded list (ordered by resonance, before the roll).** 1 fire-evacuation plan · 2 architectural construction drawing · 3 bubble answer sheet · 4 photocopied bell schedule · **5 transit line diagram ← assigned by the roll (seed 6f18a518, degraded, no challengers)** · 6 ADA room plaque · 7 scoreboard clock.

**Raises from the hands it beat** (discipline, not costume):
- *From the evacuation plan (my top pick):* readable in three seconds by someone in a hurry: one "you are here" marker, one route, nothing competing with it.
- *From the construction drawing:* geography stays **true to scale**. Unlike a Beck-style schematic, the plan isn't distorted, because distance is time here. A scale bar is always visible.
- *From the ADA room plaque:* high contrast and large room numerals as a rule, not a mode.

## Scene → light or dark
A student checks their schedule on a phone in a bright school hallway, or on a laptop at the kitchen table the night before; the summary gets printed for a meeting under office fluorescents. **Light**, like enamel transit signage, and print-first.

## Color: Full palette (4 named roles)

| Role | Token | Value | Use |
|---|---|---|---|
| Ground | `--ground` | `#EEF0EC` | App background: cool enamel grey-white (not cream) |
| Sheet | `--sheet` | `#FFFFFF` | The plan sheet and panels |
| Ink | `--ink` | `#111315` | Text, walls, station ticks, casings (18.5:1 on sheet) |
| Ink 2 | `--ink-2` | `#4A4F55` | Secondary text (8.2:1 on sheet) |
| Rule | `--rule` | `#C8CCC5` | Hairlines, dividers (non-text) |
| Network | `--network` | `#D3D7D0` | Corridors not on your route |
| Lines (one per transition) | `--line-1…7` | `#0057B8` blue · `#00843D` green · `#D45D00` orange · `#9A1E8C` magenta · `#007C80` teal · `#8A5A00` ochre · `#3D4DB7` indigo | Each passing period's route. All ≥ 3:1 on white as graphics, and cased in ink on the plan. |
| Alert | `--alert` | `#C8102E` | **Only** for "short": transitions that don't fit (5.9:1 on white) |
| Caution | `--caution` | `#8F5A00` | "Tight" text (5.9:1 on white) |
| Access | `--access` | `#0057B8` | Step-free roundel |

Rules: status is never colour alone; every verdict carries a word and a shape (● fits · ◐ tight · ▲ short). "Fits" gets no colour at all, because good news doesn't need it. Red is reserved for "short". No gradients anywhere.

## Type

| Role | Face | Why this face |
|---|---|---|
| Display: station names, headings, the wordmark | **Overpass** 800/900 | A free descendant of *Highway Gothic*, the US federal wayfinding face (FHWA road signs). American wayfinding, not a generic grotesk. |
| UI and body | **Atkinson Hyperlegible Next** 400/500/700 | Designed by the Braille Institute for low-vision readers. The product serves disabled students; the face is part of the promise. |
| Times, durations, room numbers in tables | **Atkinson Hyperlegible Mono** 400/500/700 | Tabular figures for clocks and ranges; used for measurement only, never as a "tech" costume. |

Scale (rem, 16 px base): 0.8125 · 0.875 · 1 · 1.125 · 1.375 · 1.75 · 2.5 · 3.5 · 5. Display tracking −0.02em; uppercase line labels get +0.06em. Body measure ≤ 68ch. Self-hosted woff2 (no third-party font requests, for privacy).

## Components (the transit grammar, rebuilt for school)
- **Line bullet:** a filled circle in the line colour with the period transition ("2→3") in white Overpass 800. The day's legend and the board rows both use it.
- **Station:** a room on the plan: an ink tick on the corridor plus a label plaque (room number big, class name small).
- **Interchange:** stairs and elevators: a white circle with a heavy ink ring; elevators carry the step-free roundel.
- **Departure board:** the day list. Each row: bullet · from → to · time range · the bar of the passing period, filled to the range · verdict word. A row, not a card.
- **Strip map:** the linear line diagram of one transition (as above train doors): stations and interchanges in order, with walk times between them. It doubles as the text directions.
- **Pass:** the accommodation summary, styled as a transit pass/ticket: perforated edge, bold access roundel, the exact asks. It prints on Letter/A4 as a plain timetable sheet.
- **Controls:** segmented mode selector (Walk · Crutches · Wheelchair · Custom) styled like a journey planner's mode picker; square-ended buttons (radius 2 px, like enamel signs); focus ring 3 px `--ink` with a 2 px offset.

## Motion grammar (emil animate: decided per animation)
- **Signature: "Play my day"** (rare, first-time → the delight budget): each line draws along its path (`stroke-dashoffset`, linear, duration proportional to the transition's real time, scaled 1 real minute = 1.2 s), a vehicle dot travels it (WAAPI on `offset-path` / `getPointAtLength`), and the board row lights as it arrives. Purpose: explanation + state indication.
- **Profile switch** (occasional): routes crossfade, old line out and new line drawn in over 280 ms `cubic-bezier(0.77, 0, 0.175, 1)`; verdict words update instantly (data doesn't animate for style).
- **Pass appears** (occasional): translateY(8px) + opacity, 220 ms `cubic-bezier(0.23, 1, 0.32, 1)`, 40 ms stagger on its rows.
- Hover and press: 120 ms colour/transform, gated by `(hover: hover) and (pointer: fine)`.
- **Reduced motion:** no travel and no draw-on; the playback steps row by row with a 150 ms opacity change.

## Layout
- Desktop (≥ 1100 px): the plan sheet owns ~62% width at left (the thesis at full scale); the board + controls column sits at right. Header is a thin enamel strip (wordmark bullet, sample-school label, Trace, Share).
- Tablet/phone: the plan stacks on top at a fixed aspect; the board follows; controls stick to the bottom as a mode bar. At 375 px everything stays operable without horizontal scroll (the plan pans/zooms inside its frame).
- Spacing: 4 px base; the scale 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72.

## Anti-list (this entry)
No purple/blue gradients, no centred SaaS cards, no emoji headers, no Playfair or drop shadows, no 3D blobs, no stock illustrations, no eyebrow kickers, no glassmorphism, no zero-blur offset shadows, no mono-as-costume.
