# CSC Back-to-School Hackathon

**Event page:** https://csc-back-to-school.devpost.com/  ·  **Rules:** https://csc-back-to-school.devpost.com/rules
**Deadline:** **Mon Oct 5, 2026 · 3:00 AM EDT**  (`2026-10-05T03:00:00-04:00`)
> Devpost lists it as Oct 5, 2026 @ 12:00am PDT, so in practice the night of **Sunday Oct 4**.

*Facts read from the live Devpost page on 2026-09-23. ⚠ = unconfirmed, so verify before relying on it.*

## Verification (cloud session, Wed Sep 23 2026, 22:48 EDT)
This VM's network policy blocks devpost.com, so the overview and `/rules` pages **could not be re-opened** from the cloud session (curl and WebFetch both get `403` from the egress proxy; see PROGRESS.md). What could be cross-checked independently:
- **Dates:** the ushackathons.com listing (read through WebSearch) gives **Sep 4 to Oct 5, 2026**, online. That agrees with the deadline above (Oct 5 · 12:00 AM PDT = 3:00 AM EDT). ✔
- **Organiser ⚠:** the same listing names it **"Webb Schools CSC"**, i.e. most likely the Computer Science Club of The Webb Schools (Claremont, CA, grades 9–12). One aggregator source only.
- **Audience:** "free, high school, beginner-friendly" (same listing), consistent with *Ages 13–18, students only* below. ✔
- **Prizes, rubric wording, submission list:** no second source exists in the index; they stand as captured on 2026-09-23.
- **Nothing contradicts the file.** HANDOFF.md step 1 asks Rishik to eyeball the live overview and rules pages before submitting.

## Eligibility
Ages 13–18, students only, individuals or teams up to 4.

## Theme
Build an app, tool, website or gadget that helps students, teachers or schools solve a real school-life problem: studying, scheduling, communication, organization, wellness, accessibility, campus life.

## Prizes
- Gold: $250 + $4,979 sponsor credits
- Silver: $100 + $2,519
- Bronze: $50 + $2,319
- 5 Honorable Mentions

## Submission requirements (from the event page)
- Project name and problem description
- Explanation of how it works
- Demo link / website / video / screenshots
- Tools and technologies list
- **AI-use disclosure statement**
- Team member names
- Source code
- Optional 1–2 minute demo video

## Judging criteria

| Criterion | Weight |
|---|---|
| Learning: understanding of the project and of AI tool usage | unpublished (treat as equal unless the rules say otherwise) |
| Design: UI clarity and usability | unpublished (treat as equal unless the rules say otherwise) |
| Creativity: originality, thoughtful problem-solving | unpublished (treat as equal unless the rules say otherwise) |
| Functionality: working demo or proof of concept | unpublished (treat as equal unless the rules say otherwise) |
| Impact: addresses a real school-life problem practically | unpublished (treat as equal unless the rules say otherwise) |

## Event-specific deliverables (on top of CLAUDE.md's Definition of done)
- `submission/AI-USE.md`: a truthful, specific AI-use disclosure. This is scored under “Learning”, not just required.
- `submission/video/demo.mp4`: **1:00–2:00**

## Strategy notes (starting hypotheses, which the research may overturn)
- “Learning” explicitly scores understanding of AI tool usage, so a transparent, thoughtful AI-use statement earns points.
- Do not build a study/flashcard/Socratic tutor: Rishik's earlier Explain It Back already occupies that space.

**Suggested lane:** School life beyond studying: scheduling, communication, wellness, accessibility, campus logistics.

## Sibling entries (Rishik's other open events). Do not overlap any of them

Run `bash scripts/siblings.sh` to see which concepts are already claimed.

| Repo | Event | Deadline (ET) | Lane |
|---|---|---|---|
| [`practicetocreate`](https://github.com/rishikrrontala-bot/practicetocreate) | Practice to Create | Fri Sep 25, 2026 · 12:45 PM EDT | Open: an everyday or overlooked problem, with a visually striking result. |
| [`acodemic-hackathon`](https://github.com/rishikrrontala-bot/acodemic-hackathon) | Acodemic × G.I.R.L.S. SDG | Sun Sep 27, 2026 · 12:45 AM EDT | SDG 2 / 6 / 7 / 11 / 12 / 13 / 14 / 15 (not 3 or 4). |
| [`lexhack-2026`](https://github.com/rishikrrontala-bot/lexhack-2026) | LexHack 2026 | Sun Sep 27, 2026 · 5:00 PM EDT | AI × law (pick the track the research says is least contested). |
| [`luma-hackathon-fall`](https://github.com/rishikrrontala-bot/luma-hackathon-fall) | LUMA Hackathon | Mon Sep 28, 2026 · 5:00 PM EDT | Consumer (B2C) or prosumer product with a clear subscription or transaction model. |
| [`firstcommit`](https://github.com/rishikrrontala-bot/firstcommit) | FirstCommit | Wed Sep 30, 2026 · 5:00 PM EDT | Open: a delightful, ambitious web experience. |
| [`next-byte-hacks-v4`](https://github.com/rishikrrontala-bot/next-byte-hacks-v4) | Next Byte Hacks V4 | Wed Sep 30, 2026 · 11:45 PM EDT | Bold or playful: a game, creative tool or interactive experience with real impact. |
| [`305hackshellssep2026`](https://github.com/rishikrrontala-bot/305hackshellssep2026) | 305 HackShells | Wed Sep 30, 2026 · 11:45 PM EDT | Cybersecurity education (defensive, safe), optionally powered by Gemma. |
| [`gibc-v2`](https://github.com/rishikrrontala-bot/gibc-v2) | Global Innovation Build Challenge V2 | Thu Oct 1, 2026 · 11:45 AM EDT | TECH (tiny LLM trained from scratch) or Applied-Finance. |
| [`csc-back-to-school`](https://github.com/rishikrrontala-bot/csc-back-to-school) | CSC Back-to-School **← this repo** | Mon Oct 5, 2026 · 3:00 AM EDT | School life beyond studying: scheduling, communication, wellness, accessibility, campus logistics. |
| [`ml-build-challenge-3`](https://github.com/rishikrrontala-bot/ml-build-challenge-3) | ML Empowerment Build Challenge 3.0 | Mon Oct 5, 2026 · 8:00 PM EDT | Applied ML outside health, school and law: accessibility, environment, creative tools, local community. |
| [`univabio`](https://github.com/rishikrrontala-bot/univabio) | UnivaBio | Tue Oct 6, 2026 · 11:45 PM EDT | Person-facing early detection or living-with-illness, private on-device. Must not overlap DSH Hacks V2, Baseline (concussion) or LARMOR (MRI). |
| [`creatorcolosseumshowdown`](https://github.com/rishikrrontala-bot/creatorcolosseumshowdown) | Creator Colosseum | Sat Oct 10, 2026 · 5:00 PM EDT | Teen-founder startup: B2B for small businesses, or Thumbstop. |
| [`next-founders`](https://github.com/rishikrrontala-bot/next-founders) | Next Founders | Thu Oct 15, 2026 · 5:00 PM EDT | B2B SaaS or an underserved market. |
| [`dsh-hacks-v2`](https://github.com/rishikrrontala-bot/dsh-hacks-v2) | DSH Hacks V2 | Sun Nov 8, 2026 · 2:45 AM EST | Clinician-, researcher- or system-side healthcare AI with a genuine evaluation. |
| [`innovart2027`](https://github.com/rishikrrontala-bot/innovart2027) | InnovArt 2027 | Sat Jan 2, 2027 · 12:00 PM EST | Art × technology: generative, interactive or performative. |

## Rishik's past projects. Do not repeat these

- **Explain It Back**: explain-from-memory study tool with Socratic follow-ups
- **Habitat Pulse**: ecosystem health dashboard (Open-Meteo + GBIF)
- **Baseline**: webcam oculomotor concussion screener
- **Loop Room**: four-player collaborative music loop + music video
- **Hookline**: transcript → ranked clips, hooks, captions engine
- **LeaseLeak**: rent-roll audit against HUD FMR + Zillow ZORI
- **Earshot**: acoustic modem: text over sound between browsers
- **SAKSI**: tamper-evident anonymous misconduct reporting (web3)
- **LARMOR**: low-field MRI reconstruction
- **Shade Debt**: satellite heat mapping + tree-planting ranking
- **Breathing Room**: teen anxiety guide
- **scent-shelf**: perfume collection tracker
