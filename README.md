# ComicShelf

Offline-first tracker for Polish Marvel and DC comic collections. Log in with a password, pick a catalog from the home screen, and mark owned/read issues with JSON backups.

**Live demo:** [https://pufanimalsdev.github.io/ComicShelf/](https://pufanimalsdev.github.io/ComicShelf/)

## Usage

1. Open the app and enter your password.
2. Pick a catalog tile (**Marvel PL** or **DC PL**).
3. Pick a series tile (e.g. **Marvel NOW! — Egmont**).
4. Check **Posiadam** / **Przeczytane** for each issue.
5. Use filters to search and narrow the list within that series.

**Backup (home screen only):**

- **Eksportuj kolekcję** — JSON v5 (all catalogs)
- **Importuj kolekcję** — restore from v5 (overwrites your local progress)

Inside a series you only mark issues and optionally **Wyczyść tę serię**.

Data is stored in `localStorage` in the current browser.

## Initial state (seed from repo)

[`data/initial-state.json`](data/initial-state.json) is loaded on login via `fetch` (GitHub Pages). For each catalog:

- **No saved state yet** → seed is applied
- **You already saved progress** (`localStorage` + user marker) → seed is **never** overwritten

Update the seed after export:

```bash
node scripts/update-initial-state.js path/to/comicshelf-all-YYYY-MM-DD.json
git add data/initial-state.json
git commit -m "📦 data: update initial collection state"
```

New catalogs in seed apply only for users who do not yet have that catalog in `localStorage`.

## Access (password)

The app uses **client-side password protection** (SHA-256 hash, session in `sessionStorage`). This keeps casual visitors out but is not military-grade security — the hash is visible in the repo.

Set or change your password locally:

```bash
node scripts/set-password.js "your-password"
```

This updates [`js/auth-config.js`](js/auth-config.js) with a new hash. Commit only the hash file, never the plaintext password.

Default password after a fresh clone is `changeme` — change it before deploying.

## JSON backup format (v5)

Export from home produces v5 — the same format as [`data/initial-state.json`](data/initial-state.json):

```json
{
  "app": "ComicShelf",
  "version": 5,
  "generatedAt": "2026-07-14T18:44:07.625Z",
  "catalogs": {
    "marvel-pl": { "owned": ["..."], "read": ["..."] },
    "dc-pl": { "owned": ["..."], "read": ["..."] }
  }
}
```

Import on home accepts v5, v4 (single catalog), or legacy array (Marvel PL only).

## Project structure

```
ComicShelf/
├── index.html
├── css/styles.css
├── js/
│   ├── auth-config.js  # password hash (set via set-password.js)
│   ├── auth.js         # login / session
│   ├── router.js       # view switching
│   ├── home.js         # catalog tiles
│   ├── catalog.js      # catalog registry
│   ├── storage.js      # localStorage + legacy migration
│   ├── backup.js       # JSON import/export
│   ├── bootstrap.js    # initial-state seed loader
│   └── app.js          # series list UI
├── data/
│   ├── initial-state.json  # default state shipped with the app
│   ├── marvel-pl.js    # embedded catalog (622 comics)
│   └── dc-pl.js        # embedded catalog (81 comics)
├── scripts/
│   ├── set-password.js
│   └── update-initial-state.js
└── .github/workflows/pages.yml
```

## Deploy

Pushes to `main` deploy automatically to GitHub Pages via GitHub Actions.

### One-time setup (required)

If the workflow fails with `Get Pages site failed` / `Not Found`, GitHub Pages is not enabled yet. The workflow **cannot** enable it by itself — you must do this once in the repo settings:

1. Open **[Settings → Pages](https://github.com/PufAnimalsDev/ComicShelf/settings/pages)**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Re-run the failed workflow from **[Actions](https://github.com/PufAnimalsDev/ComicShelf/actions)** (or use **Run workflow** on `Deploy GitHub Pages`).

After that, every push to `main` deploys to `https://pufanimalsdev.github.io/ComicShelf/`.

On deploy, CI runs `scripts/prepare-pages.js`: it stamps each CSS/JS/data URL with `?v=<commit>` so browsers fetch fresh files after an update (no manual cache clear needed). Your collection in `localStorage` is not touched.

**Via GitHub CLI** (alternative to step 2):

```bash
gh auth login
gh api repos/PufAnimalsDev/ComicShelf/pages -X POST -f build_type=workflow
```

## Git workflow

### Commits

```
<emoji> <type>: <short subject>

[optional bullets for larger changes]
```

Examples: `✨ feat: …`, `🐛 fix: …`, `📦 data: …`, `🚀 deploy: …`

### Branches and PRs

1. Create a feature branch from `main` (e.g. `feat/auth-catalog-tiles-v5-backup`).
2. Push the branch and open a PR into `main`.
3. Use the PR template (Summary / Changes / Test plan).
4. After merge, the **head branch is deleted automatically**.

Enable auto-delete once in the repo:

1. **[Settings → Pull Requests](https://github.com/PufAnimalsDev/ComicShelf/settings)** → check **Automatically delete head branches**.

Or via CLI after `gh auth login`:

```bash
gh api repos/PufAnimalsDev/ComicShelf -X PATCH -f delete_branch_on_merge=true
```

When merging a PR from the terminal:

```bash
gh pr merge --delete-branch
```

## License

Public catalog data is for personal collection tracking. Marvel and DC characters and titles are property of their respective owners.
