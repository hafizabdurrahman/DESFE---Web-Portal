# DESFE - Digital Education System for Everyone
Offline-first PWA (HTML/CSS/JS, no build step). Theme: orange gradient `#F96806 / #FC9311 / #C32202`, font Plus Jakarta Sans (in `fonts/`), light + dark mode.

## Setup
1. Copy `.env.example` to `.env`, fill in your Appwrite values, run `node build-env.js` (creates `env.js`).
2. Serve over HTTPS or localhost (`npx serve .`) and use "Add to Home Screen / Install".
3. Appwrite console: add your site's domain as a **Web platform**.

## Appwrite `users` table (Databases, id = `users`; Document ID = Auth user ID)
| Column | Type | Size / notes |
|---|---|---|
| name | string | 128, required |
| email | string | 254, required, unique index |
| password | string | 128, required (SHA-256 hash, not plain text) |
| age | string | 32 |
| goal | string | 255 |
| institute | string | 255 |
| avatarId | string | 64 (file ID in the bucket) |
| profilePct | integer | 0-100 |
| blocked | boolean | default false (set true in console to block) |
| backupAt | datetime | set when the user backs up |
| updatedAt | datetime | |
| data | string | 1000000 (or longtext/mediumtext) - courses, MCQs, tests, attempts as JSON |

**Permissions:** table level: role `Users` -> Create. Turn **Document security ON** (creator can read/update own row). Bucket: role `Users` -> Create, Read.

## MCQ JSON format (upload per subject)
`[{"question":"...","options":["A","B","C","D"],"answer":1,"explanation":"optional"}]`
`answer` can be a 0-based index, a letter (A-G) or the exact option text. See `sample-mcqs.json`.

## How it behaves
- Account creation needs internet once; afterwards everything is stored locally and works offline.
- When online, changes sync to Appwrite (debounced). Login on a new device restores the data.
- If `blocked` = true, the user only sees the block page and a **Download backup** button. Backup (needs internet) saves everything into the `data` column, downloads a copy, and wipes local data.
- Tests: answered questions lock when you press Next; last answer auto-submits; timed tests auto-submit at zero; untimed tests have Save/Resume; retakes link to the previous attempt; leaderboard has course/test/timed filters.
