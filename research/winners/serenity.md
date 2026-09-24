# Winner brief: Serenity

**Hackathon:** DualHacks 2023 (Codology, on Devpost, Aug 2023; 500+ students from 30 countries) · **Prize won:** First place, Beginner Hackathon track (as stated in Codology's official recap)
**Submission URL:** gallery https://dualhacks.devpost.com/project-gallery · **Recap:** https://www.codology.org/post/dualhacks-2023-a-recap · **Repo:** https://github.com/jshan9078/Serenity (**cloned and read**) · **Demo video:** https://www.youtube.com/watch?v=CXMhdcRRdu8 (linked from the repo; not watched, YouTube is blocked here)
**Verified:** page loaded ☐ (Devpost blocked) · prize stated on page ☑ (organiser recap, via WebSearch) · video played ☐ · **repo opened ☑**
**Age flag:** August 2023, about 25 months old, just outside the 24-month window. Kept because it's a Devpost student hackathon with a school-life theme and the only winner whose code this VM could open.

## Pitch, verbatim from the repo README
> "I was inspired to build this project because I have always struggled to keep up with teachers that speak somewhat fast. I've also zoned out a lot with some teachers who speak quite slowly."

## The wow moment
From the README: start recording, and a live transcript appears in Chrome's side panel while a pace cue says "Good Pace", "Slow Down" or "Too Fast". Saying "stop recording" ends it.

## Demo teardown
- Length unknown (not watched). README screenshots show four states: landing, good pace, slow down, too fast, plus the final transcript.
- Real data: live microphone input through the Deepgram API.

## Scope reality
- Git history: 22 commits; the first three ("Initial commit", "Transcription + WPM tracking", "added some UI features") are all dated 2023-08-07, so the core was built inside the event window.
- One feature, done end to end. The README even documents a design decision (characters ÷ 5 instead of raw word counts for WPM) in the Challenges section.

## Stack
Manifest V3 Chrome extension, Side Panel API (then Chrome Beta), Deepgram over WebSocket, webpack. The brand-new Side Panel API was part of the story.

## Submission page shape
README mirrors a Devpost write-up: Inspiration → How I built it → Challenges → Accomplishments → What I learned, with five captioned screenshots.

## Why this won (one sentence)
A one-person, first-person classroom problem, one feature working live, and an honest account of what was hard and what was learned.

## Transferable to us
- Copy: the first sentence is "I have always struggled to…", specific and personal.
- Copy: a "Challenges" section that explains a real technical decision in plain words. It maps straight onto this event's **Learning** criterion.
- Copy: the few UI states, each screenshotted and captioned.
