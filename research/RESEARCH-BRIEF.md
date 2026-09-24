# Research brief: CSC Back-to-School Hackathon

*Full-depth pass (268 h to the deadline), Wed Sep 23 2026, 22:40 to 23:40 EDT. Searches batched in parallel, inline (no subagents).*

## How this research was done, and its limits (read first)
This cloud VM's network policy **blocks devpost.com and every \*.devpost.com page** for both `curl` and WebFetch. So are youtube.com, wikipedia.org, huggingface.co, cdn.jsdelivr.net, unpkg.com, reddit, medium and dev.to, and the GitHub search API. What works: WebSearch (server-side), `git clone` of public GitHub repos, npm, PyPI and Google Fonts. Consequences:
- **The event pages couldn't be re-opened.** HACKATHON.md was captured from the live page on 2026-09-23. The facts that could be cross-checked independently are marked in HACKATHON.md › *Verification*. Re-checking the deadline on the live page is step 1 of HANDOFF.md.
- **No winner page was opened in a browser, and no video was watched.** Each brief records exactly what was verified and how: the prize **as stated by an official source** (the Congressional App Challenge's own per-district winner pages, House press releases, and the organiser Codology's recap), read through WebSearch, plus the repo whenever it was public and cloneable. Anything a source didn't state is written as *unknown*, never guessed.
- Competitor repos found for **this** event were cloned and read (below).

## The event, precisely
- **Organiser: most likely the Computer Science Club of The Webb Schools** (a grades 9–12 boarding and day school in Claremont, CA). The ushackathons.com listing, read through WebSearch, describes "Webb Schools CSC" as an online, free, beginner-friendly high-school hackathon running **September 4 to October 5, 2026**, which matches this event's Devpost dates. ⚠ This is one aggregator's listing, so treat the organiser identity as likely, not certain. The club's public GitHub org (github.com/Webb-School-Computer-Science-Club) has built **Verallel**, "a student-made, student-tailored web extension for Veracross" that improves navigation of the school's own portal (cloned and read). That's a revealing signal: **this club builds practical quality-of-life tools for its own school.**
- **First edition.** No earlier "CSC Back-to-School" gallery exists in the search index. Per the skill, with no history the judges, organiser and same-shape events are the signal.
- **Judges** aren't published (as far as the index shows). A school CS club's hackathon is typically judged by its student officers and a faculty advisor, i.e. **high-school students who know CS**. They'll relate to school-life pain directly, and they'll appreciate a real algorithm they can recognise.
- **Rubric** (HACKATHON.md): Learning (understanding of the project **and of AI tool usage**), Design (UI clarity and usability), Creativity (originality, thoughtful problem-solving), Functionality (working demo or proof of concept), Impact (a real school-life problem, practically). Weights unpublished, so we treat them as **equal (20% each)**.

## The field we're up against (this edition, found and read)
| Entry | What it is | Read |
|---|---|---|
| **PACE** (github.com/kogleshofficial-hub/PACE) | "Planning Academic Capacity & Effort", a workload planner: assignments + effort estimates + daily capacity → a 7-day plan. Next.js 15 + Appwrite auth + Vercel. Polished README, stated "built for the CSC Back-to-School Hackathon". | cloned |
| CSC-back-to-school-hackathon (Luiszzen) | A beginner HTML/JS page ("HELLO, YEGUA!") | cloned |
| CSCHCKTN.BABA (EcuadorianYT) | A beginner team repo, HTML/CSS/JS | cloned |

The field spans beginners through at least one strong, polished entry. **PACE owns "academic workload planning"**, so we must be clearly elsewhere.

## Winners studied (7; see the briefs)
| Project | Event | Prize (as the source states it) | Problem shape |
|---|---|---|---|
| [Catalyst](winners/catalyst.md) | Congressional App Challenge 2025, KS-3 | District winner | Personal frustration with the school's own software (Canvas) |
| [UHS](winners/uhs.md) | Congressional App Challenge 2025, CA-11 | District winner | Campus life beyond class: belonging, clubs, lunch, one real school |
| [Sound Track EDU](winners/sound-track-edu.md) | Congressional App Challenge 2025, CA-50 | 2nd place, district | Classroom **accessibility** for deaf and hard-of-hearing students |
| [Lexia](winners/lexia.md) | Congressional App Challenge 2025, CA-3 | District winner | **Accessibility**: dyslexia, and school accommodations being "inconsistent" |
| [SyncRide](winners/syncride.md) | Congressional App Challenge 2025, CA-30 | District winner | Teen **logistics**: getting to places |
| [Serenity](winners/serenity.md) | DualHacks 2023 (Devpost) · age-flagged | 1st, Beginner track | "I have always struggled to keep up with teachers that speak fast": one live feature |
| [HuddleUp](winners/huddleup.md) | DualHacks 2023 (Devpost) · age-flagged | 1st, Ideathon track | **Equity** in the classroom, teacher-side |

Why the Congressional App Challenge (CAC) is the main comparison set: it's the largest competition with the **same entrant pool** (US high-school students, individuals or teams up to 4), the **same brief** (build an app that solves a real problem), and a **similar rubric**: "Quality of the idea (including creativity and originality) · Implementation of the idea (including user experience and design) · Demonstrated excellence of coding and programming skills" (CAC judging rubric, via WebSearch of congressionalappchallenge.us). Its 2025 round had 13,800+ students and 4,600+ apps, and its per-district winner pages are official and dated.

## Pattern

**Problem shape that wins:** *a specific, felt school-life problem of a named group of students, usually told first-person.* Three of seven winners are **accessibility inside school** (Sound Track EDU, Lexia, and Serenity is part-accessibility). Lexia's founders name the exact gap we can exploit: accommodations "can be inconsistent". Two more are school logistics or belonging beyond class (UHS, SyncRide). Only one (Catalyst) is academic organisation, and it wins on a hyper-specific irritation, not on "planning".

**Demo shape:** CAC requires a 1–3 minute video that states the name, purpose and audience, and **shows the app working**. This event asks for 1–2 minutes. Winners show their own real data (Catalyst on real Canvas, UHS on its real school, Serenity on a live mic). The first 15 seconds must show the thing working.

**Scope ceiling:** a single developer ships one core transformation, done end to end (Serenity: live pace cue; Lexia: page → accessible format). A month-long window (Sep 4 to Oct 5) lets a winner add polish and a second supporting feature, but not breadth.

**What winners skip:** accounts, admin panels, feature breadth, platform plays. The multi-user ones (SyncRide, UHS) need a backend or one school's data, which we can't provide statically and don't want.

**Visible judge bias:** a school CS club that itself builds quality-of-life tools for its own campus (Verallel) will reward (a) a problem they've lived at school, (b) a real algorithm they can recognise and respect, and (c) a clear, honest account of how AI was used (a scored criterion here, "Learning", and unusual on other rubrics).

## What this means for our concept (the filter used in CONCEPTS.md)
1. **School life beyond studying.** Stay out of PACE's workload lane and Rishik's Explain It Back study lane.
2. **A named group and a first-person-feelable moment** in sentence one. Accessibility inside school is the strongest winning shape we found.
3. **One transformation that visibly works** in the first 15 seconds, on data a judge can recognise (ideally their own).
4. **A real, explainable algorithm** (Learning + Functionality), not an API wrapper. Explaining *why* AI is or isn't inside the product is itself a Learning point.
5. **Static, on-device, no key, no account.** Nothing can break when a judge opens it cold. Privacy is a feature for anything touching disability or student data.
6. **Name the prior art and the limitation** plainly (credibility for Impact and Creativity).

## Sources (all read through WebSearch on 2026-09-23 unless marked "cloned")
- Event listing (organiser, dates): https://ushackathons.com/ ("Webb Schools CSC", Sep 4 to Oct 5, 2026, online, free, high school)
- Organiser's GitHub: https://github.com/Webb-School-Computer-Science-Club · Verallel: https://github.com/Webb-School-Computer-Science-Club/Verallel (cloned)
- Competitors: https://github.com/kogleshofficial-hub/PACE (cloned) · https://github.com/Luiszzen/CSC-back-to-school-hackathon (cloned) · https://github.com/EcuadorianYT/CSCHCKTN.BABA (cloned)
- CAC winners index: https://www.congressionalappchallenge.us/2025-winners/ · recap: https://www.congressionalappchallenge.us/record-breaking-year-for-congressional-innovation-2025-challenge-recap/
- CAC rules and rubric: https://www.congressionalappchallenge.us/wp-content/uploads/2026/05/2026-CAC-Rules.pdf · https://www.congressionalappchallenge.us/wp-content/uploads/2018/10/CAC_Rubric_2018.pdf
- DualHacks 2023 recap: https://www.codology.org/post/dualhacks-2023-a-recap · Serenity repo: https://github.com/jshan9078/Serenity (cloned)
- Per-winner URLs are in each brief.
