# AGENTS.md

Quick orientation for working in this repository. Read this first before making changes.

## What this repo is

A static **GitHub Pages study-notes site** for **SPPU (Pune University) exam preparation**. It is a plain HTML + CSS + JS site — no build step, no framework, no package.json.

- Live site is served from the `docs/` folder (GitHub Pages).
- Deployed via `.github/workflows/deploy.yml`.
- Only files under `docs/` are shipped.

## Folder layout

```
docs/
├── index.html            # Home page — grid of subject cards
├── assets/
│   ├── notes.css         # Shared styling (dark GitHub-like theme)
│   └── notes.js          # Shared viewer: loads unit markdown, builds nav/TOC
├── OB/                   # Organisational Behaviour
│   ├── index.html
│   └── unit1.md ... unit5.md
├── cloudApi/             # Cloud API
├── ethicalNotes/         # Ethical Hacking
└── IED/                  # Innovation, Entrepreneurship & Design
```

## How a subject page works

Every subject folder contains:

1. **`index.html`** — a copy of the shared template with a `window.NOTES` config block:
   - `files`: maps unit keys to markdown filenames (e.g. `unit1: 'unit1.md'`).
   - `units`: array of `{ key, num, title }` used for the navbar links and unit cards.
   - Must load `marked.min.js` (CDN), then `../assets/notes.css` and `../assets/notes.js`.
2. **Markdown unit files** — the actual notes. `notes.js` fetches the file, renders it with `marked`, makes tables collapsible, and builds a TOC sidebar from `h1/h2/h3`.

`assets/notes.js` reads everything from the `window.NOTES` config; do not edit it to add subjects — edit the config in each subject's `index.html` instead.

## Adding a new subject (checklist)

1. Create a folder `docs/<SubjectName>/`.
2. Copy the `index.html` template from an existing subject and edit:
   - `<title>` and `.brand` text
   - `window.NOTES.units` titles and `files` map
3. Write the unit markdown files.
4. Add a matching `<a class="card" href="<SubjectName>/">` block in `docs/index.html`.

## Notes style conventions (match existing files)

- `#` = Unit title, `##` = numbered section (e.g. `1.1`), `###` = subsection, `####` = sub-points.
- Use **tables** for comparisons (e.g. concept/definition, factor/description).
- Use `> ` blockquote with **"SPPU Exam Tip"** for mark-weighting hints.
- Content is **exam-oriented and dense**: definitions first, then bullets, then tables.
- Plain ASCII in most files; emoji allowed only in `docs/index.html` card icons.
- No code comments unless asked.

## Verification

- No automated tests, lint, or build. To verify: re-open the modified `index.html` in a browser and check units load; or fetch the markdown paths to confirm they exist.
- After changes run `git status` / `git diff` before committing. Commit messages follow conventional style (e.g. `feat:`, `fix:`).
