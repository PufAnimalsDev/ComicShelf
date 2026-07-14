# ComicShelf

Offline-first tracker for Polish Marvel and DC comic collections. Log in with a password, pick a catalog from the home screen, and mark owned/read issues with JSON backups.

**Live demo:** [https://pufanimalsdev.github.io/ComicShelf/](https://pufanimalsdev.github.io/ComicShelf/)

## Usage

1. Open the app and enter your password.
2. Pick a catalog tile (**Marvel PL** or **DC PL**).
3. Pick a series tile (e.g. **Marvel NOW! — Egmont**).
4. Check **Posiadam** / **Przeczytane** for each issue.
5. Use filters to search and narrow the list within that series.

**Backup:**

- **Home** — export/import all catalogs (JSON v5)
- **Inside a series** — export/import the whole catalog (JSON v4); reset clears only the current series

Data is stored in `localStorage` in the current browser. Export regularly if you switch devices or clear site data.

## Access (password)

The app uses **client-side password protection** (SHA-256 hash, session in `sessionStorage`). This keeps casual visitors out but is not military-grade security — the hash is visible in the repo.

Set or change your password locally:

```bash
node scripts/set-password.js "your-password"
```

This updates [`js/auth-config.js`](js/auth-config.js) with a new hash. Commit only the hash file, never the plaintext password.

Default password after a fresh clone is `changeme` — change it before deploying.

## JSON backup formats

### v4 — single catalog (export from inside a catalog)

```json
{
  "app": "ComicShelf",
  "catalog": "marvel-pl",
  "version": 4,
  "generatedAt": "2026-07-14T15:00:00.000Z",
  "owned": ["Marvel NOW! — Egmont|1|Avengers: Wojna bez końca"],
  "read": []
}
```

### v5 — all catalogs (export from home / catalog tiles)

```json
{
  "app": "ComicShelf",
  "version": 5,
  "generatedAt": "2026-07-14T15:00:00.000Z",
  "catalogs": {
    "marvel-pl": {
      "owned": ["..."],
      "read": ["..."]
    },
    "dc-pl": {
      "owned": ["..."],
      "read": ["..."]
    }
  }
}
```

| Field | Description |
|-------|-------------|
| `generatedAt` | ISO 8601 timestamp when the backup was created |
| `catalog` | Catalog identifier in v4 single exports (`marvel-pl`, `dc-pl`) |
| `catalogs` | All catalog states in v5 multi exports |
| `owned` / `read` | Arrays of comic IDs from the embedded catalog |

**Import behavior:**

- **Home screen** — accepts v5 (all catalogs), v4 (one catalog from `catalog` field), or legacy array (Marvel PL only)
- **Inside a catalog** — accepts v4 for that catalog, or v5 (only the matching catalog section is applied)

**Backward compatibility:** legacy plain arrays (owned only) and v3 exports with `exportedAt` are still accepted.

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
│   └── app.js          # catalog list UI
├── data/
│   ├── marvel-pl.js    # embedded catalog (604 comics)
│   └── dc-pl.js        # embedded catalog (81 comics)
├── scripts/
│   └── set-password.js
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
