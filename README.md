# DESFE - Digital Education System for Everyone
Offline-first PWA (HTML/CSS/JS, no build step). Theme: orange gradient `#F96806 / #FC9311 / #C32202`, font Plus Jakarta Sans (in `fonts/`), light + dark mode.

## Setup
1. **Configure Appwrite.** Easiest: open `env.js` and paste your endpoint, project ID, database ID, table ID (`users`) and bucket ID. Or copy `.env.example` to `.env`, fill it in and run `node build-env.js`.
   - A hosting service (Netlify/Vercel) does **not** read `.env` at runtime. The values must end up inside `env.js` that you deploy.
2. Keep the folder layout: `index.html, env.js, sw.js, manifest.json, vendor/appwrite.js, fonts/, icons/`.
3. Serve over HTTPS or localhost (`npx serve .`) and use "Add to Home Screen / Install".
4. Appwrite console: Overview -> Add platform -> **Web**, hostname = your site domain (e.g. `localhost`, `yourapp.netlify.app`). Without this the browser blocks every request.
5. After changing `env.js` or deploying a new version, bump `V` in `sw.js` (e.g. `desfe-v3`).

## Troubleshooting
The message under the form tells you what is wrong: SDK file missing, `env.js` empty, offline, or the Appwrite error text. "Cannot reach Appwrite" = wrong endpoint or Web platform not added. "Account was created but the profile could not be saved" = table columns/permissions; fix them, then use **Log in** (it recreates the missing profile row).

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