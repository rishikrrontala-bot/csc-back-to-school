# Concepts: three candidates, scored

*Wed Sep 23 2026, 22:50 EDT · 268 h to the deadline. Rishik delegated the pick (CLAUDE.md › Override), so the highest weighted score wins.*

## Rubric and weights
The event publishes five criteria but no weights, so each is weighted **20%** (HACKATHON.md). Scores run 1–5 per criterion, and the weighted score is their mean.

| Criterion | What earns a 5 here (from RESEARCH-BRIEF.md) |
|---|---|
| **Learning** | Rishik can explain every part in plain words. A real algorithm, not an API call. A thoughtful, specific account of how AI tools were (and weren't) used. |
| **Design** | The first screen explains itself, the UI is clear at 375 px, and the whole thing looks intentional rather than templated. |
| **Creativity** | An angle the judges haven't seen, and visible problem-solving (a non-obvious insight). |
| **Functionality** | Works end to end, live, cold, with no key; ideally on the judge's own data. |
| **Impact** | A real school-life problem for a named group, solved practically. |

Filters applied first (from the research and HACKATHON.md): not a study tool (Explain It Back); not academic workload planning (PACE is already in this event); not commute or driving (the sibling Low Sun); not teen anxiety (the past Breathing Room); not audio or transcripts (Earshot, Hookline); static and no key.

---

## A. Between Bells: *every passing period, timed for the way you move*

**Pitch:** Between Bells times every passing period on your schedule for the way *you* move (walking, on crutches, in a wheelchair), finds the route that actually works (elevator, ramp, fewer stairs), and turns a vague "needs extra time between classes" into exact minutes you can take to your school.

**The problem:** schools give everyone the same few minutes between bells (five is the most common in the US). On crutches, in a wheelchair, with a heart condition or a broken ankle from Friday's game, some of those transitions can't be done, and nobody can say *which* or *by how much*. Official guidance says a student with a mobility device may need an accommodation to leave class early to avoid hallway congestion (DoDEA Section 504 examples), but the note usually just says "extra time". Meanwhile every freshman and transfer student spends week one lost.

**Non-obvious insight:** the map already exists. Fire codes for educational occupancies require an evacuation plan posted inside the exit door of each room (Indiana's *Fire Code Awareness in Schools*). Trace it once (click the halls, name the rooms, mark stairs and elevator) and the whole school gets routing that knows the bell schedule. The traced school travels inside a share link, so there's no server and no account.

**What it does:**
1. Pick your rooms for each period on a school map (a built-in sample school, or your own traced one).
2. Pick how you move: walking, crutches, wheelchair, or a custom speed, plus "avoid stairs" and "stop at locker".
3. **Play your day:** the route for every transition animates across an architectural floor plan against a bell clock. Each transition gets an honest *range* ("2:50–3:40 of your 5:00"), because speeds vary, never a fake-precise number.
4. Transitions that don't fit turn red with the reason ("elevator detour + 2 floors: 5:40–7:20 needed, 5:00 given").
5. **Accommodation summary:** a printable, plain-language page listing the exact transitions, suggested early-release minutes and elevator needs, to bring to the school's 504 coordinator. It's a starting point for that conversation, never legal advice.
6. Turn-by-turn text directions built only from the map's own labels (screen-reader friendly, and no invented hallways).
7. **Trace your school:** upload a photo of the evacuation map, click hallways and rooms, set the scale from one known length, and share the link.

**Wow moment (first 15 s):** a hairline floor plan; the bell rings; a dot runs Room 118 → 204 with the clock ticking, landing with 1:10 to spare. Flip the profile to *crutches*: the route re-draws through the elevator, two transitions go red, and the accommodation summary assembles itself.

**Riskiest technical unknown:** the tracing editor (multi-floor, image scale, fast enough to use), and making the animated day look studio-grade, not like a debug view.

**Cut first if time runs short:** outdoor paths between buildings → photo-upload tracing (keep tracing over the sample plan) → back-to-school-night sharing.

**Prior art, named:** enterprise indoor wayfinding (Mappedin, Concept3D, Mapsted) offers accessible routing for paying campuses, and many student hackathon "campus navigator" apps exist. None of them times a student's own bell schedule per mobility profile, reports honest ranges, or turns the result into an accommodation request. None is free, account-less and traceable by a student in one sitting.

| Criterion | Score | Why |
|---|---|---|
| Learning | **5** | Dijkstra on a time-weighted graph, speed ranges from cited gait studies, interval arithmetic for honest ranges. Every piece is explainable by a high-school CS student. "Why there's no AI in the product" (an LLM could invent a hallway) is itself a thoughtful AI-use point. |
| Design | **5** | An architectural-drawing art direction that is the product, not decoration. One clear flow, and the animated day explains itself without narration. |
| Creativity | **4** | Campus navigation isn't new; timing passing periods per mobility profile, the accommodation output, and "trace the evacuation map" are. |
| Functionality | **4** | Fully real on the sample school and on any traced map. A judge's own school needs about 10 minutes of tracing, and the tracer is demonstrable live. |
| Impact | **4** | Every new student in week one; students on crutches, in wheelchairs or with chronic conditions all year; substitutes and visitors. It turns a real 504 accommodation from vague to exact. |
| **Weighted** | **4.40** | |

---

## B. Syllabus X-ray: *every syllabus, one semester, the crunch weeks lit up*

**Pitch:** drop in your six syllabi (PDF or pasted text). Syllabus X-ray pulls out every dated test, project and due date **with the exact source line**, finds the weeks where your classes pile up, puts late-work and retake policies side by side, and exports a calendar.

**Wow moment:** six PDFs fall in; a semester strip paints in and the week of Oct 12 glows ("3 tests + a project, across 4 classes").
**Riskiest unknown:** date extraction from messy real syllabi (tables, "the Friday after break") without an LLM; chrono-node gets most of it, and every item stays user-confirmable.
**Cut first:** policy matrix → .ics export.
**Prior art:** many "AI syllabus → calendar" tools already exist for college students; PACE (in this event) covers the workload planning next door.

| Criterion | Score | Why |
|---|---|---|
| Learning | 4 | pdf.js text extraction, a deterministic date parser, rule-based classification: all explainable. |
| Design | 4 | A semester timeline is clean but conventional (and close to the sibling Low Sun's year-calendar visual). |
| Creativity | 3 | Crowded idea space; crunch detection is the only real twist. |
| Functionality | 5 | Works on a judge's own real syllabus, live. |
| Impact | 4 | Every student has syllabi, but it's academic organisation, next to PACE's lane and the "studying" lane HACKATHON.md steers away from. |
| **Weighted** | **4.00** | |

---

## C. Fair Seats: *a seating chart that honours every 504 and mixes the room*

**Pitch:** a teacher pastes a roster and marks needs (front-row seating from a 504, near the door for medical reasons, keep-apart pairs, a bilingual buddy for a new English learner). Fair Seats solves the chart with simulated annealing, explains every placement, and plans seat rotations so each student sits next to as many different classmates as possible over the semester.

**Wow moment:** thirty names scatter, then settle into seats as every constraint ring turns green; a counter shows "18 different neighbours this semester vs 7 by random shuffle".
**Riskiest unknown:** a UI for constraints that a tired teacher will actually fill in during week one.
**Cut first:** rotation planner → room-layout editor.
**Prior art:** many seating-chart generators exist (random plus keep-apart pairs); accommodations as first-class constraints plus a mixing objective is the twist.

| Criterion | Score | Why |
|---|---|---|
| Learning | 4 | Simulated annealing and a clear objective function; explainable. |
| Design | 4 | A satisfying settle animation; otherwise a standard grid. |
| Creativity | 3 | Seating tools are familiar; the mixing metric is novel-ish. |
| Functionality | 5 | Paste any roster; works instantly. |
| Impact | 3 | Real, but teacher-side; student judges feel it less, and it happens once a term. |
| **Weighted** | **3.80** | |

---

## The pick: **A · Between Bells (4.40)**

- It sits squarely in the winning shape the research found: **accessibility inside school, for a named group**, the same family as Sound Track EDU and Lexia, where the judges already saw that school accommodations are "inconsistent".
- It's the only one of the three whose **wow moment is inherently visual** (a route racing a bell) and whose core is a **real algorithm** a CS-club judge will recognise.
- It's the furthest from PACE and from every sibling and past project.

**Pre-mortem: "it's judging day and we lost. Why?"**
1. *"It's another campus-map app."* → Never lead with navigation. Lead with the clock and the red transition: *time* is the product; the map is how we compute it.
2. *"It only works on your made-up school."* → Show tracing a hallway live in the video (about 10 s), and make the share link the proof that any school can be added in one sitting.
3. *"The numbers look invented."* → Every speed is a cited range, every result is a range, every parameter is editable, and the sources sit one click away in the product.
4. *"It broke on my phone."* → 375 px is a first-class layout, tested in Playwright.
