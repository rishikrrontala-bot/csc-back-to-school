# CONCEPT: Between Bells

**Event:** CSC Back-to-School Hackathon · **Lane:** school life beyond studying: accessibility + campus logistics · **Claimed:** Wed Sep 23 2026, 22:51 EDT

**One line:** *Every passing period, timed for the way you move.* Between Bells times each transition on your schedule for how you actually get around (walking, on crutches, in a wheelchair), finds the route that works (elevator, ramp, fewer stairs), and turns a vague "needs extra time between classes" into exact minutes you can take to your school.

**The problem:** everyone gets the same few minutes between bells (five is the most common in the US). A student on crutches, in a wheelchair or with a heart condition can't make some of those transitions, and nobody can say which ones or by how much. Official 504 guidance names "leave class early to avoid hallway congestion" as an accommodation for students with mobility devices, yet the note usually just says "extra time". Every freshman and transfer student also spends week one lost.

**The user:** a student with a mobility need, permanent or temporary (a sprained ankle counts), plus the 504 coordinator they talk to, and every new student in week one. (These are personas, not real users.)

**What it does**
1. Put your rooms for each period on a school map (a built-in sample school, or your own traced one).
2. Choose how you move: walking, crutches, wheelchair or a custom speed; plus avoid stairs and add a locker stop.
3. **Play your day:** each transition's route animates across an architectural floor plan against the bell clock, and each result is an honest range (for example "2:50–3:40 of your 5:00").
4. Transitions that don't fit turn red, with the reason.
5. **Accommodation summary:** a printable page of the exact transitions, the suggested early-release minutes and the elevator needs, as a starting point for the 504 conversation (never legal advice).
6. Text turn-by-turn directions built only from the map's own labels (works with a screen reader).
7. **Trace your school** from the evacuation map that fire code puts inside every classroom door, then share it as a link (no server, no account).

**Wow moment (first 15 s of the video):** the bell rings, a dot races from Room 118 to 204 against the clock and lands with 1:10 to spare; flip to *crutches*, and the route re-draws through the elevator, two transitions go red, and the accommodation summary assembles itself.

**Named prior art:** enterprise indoor wayfinding (Mappedin, Concept3D, Mapsted) and many student "campus navigator" hacks. We differ on bell-schedule timing per mobility profile, honest ranges, the accommodation output, and student-traceable maps shared by link.

**Stack:** Vite + TypeScript, a pure-function routing engine (Dijkstra on a time-weighted multi-floor graph, interval arithmetic), SVG rendering, Vitest + Playwright, GitHub Pages. No backend, no key, no tracking: disability-related data never leaves the device.

Full scoring: `research/CONCEPTS.md` (A 4.40 · B 4.00 · C 3.80).
