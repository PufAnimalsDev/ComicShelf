# ComicShelf

Offline-first tracker for Polish Marvel comic collections. Mark owned and read issues, filter the catalog, and back up your progress as JSON.

**Live demo:** [https://pufanimalsdev.github.io/ComicShelf/](https://pufanimalsdev.github.io/ComicShelf/)

## Usage

1. Open [`index.html`](index.html) in a browser (works offline from disk).
2. Check **Posiadam** / **Przeczytane** for each issue.
3. Use **Eksportuj kopię** to download a JSON backup.
4. Use **Importuj kopię** to restore from a backup file.

Data is stored in `localStorage` in the current browser. Export regularly if you switch devices or clear site data.

## JSON backup format (v4)

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

| Field | Description |
|-------|-------------|
| `generatedAt` | ISO 8601 timestamp when the backup was created |
| `catalog` | Catalog identifier (`marvel-pl`) |
| `owned` / `read` | Arrays of comic IDs from the embedded catalog |

**Backward compatibility:** legacy plain arrays (owned only) and v3 exports with `exportedAt` are still accepted on import.

## Project structure

```
ComicShelf/
├── index.html
├── css/styles.css
├── js/
│   ├── catalog.js    # catalog registry
│   ├── storage.js    # localStorage + legacy migration
│   ├── backup.js     # JSON import/export
│   └── app.js        # UI logic
├── data/marvel-pl.js # embedded catalog (594 comics)
└── .github/workflows/pages.yml
```

## Deploy

Pushes to `main` deploy automatically to GitHub Pages via GitHub Actions.

**One-time setup** (required before the first deploy succeeds):

1. Open [ComicShelf → Settings → Pages](https://github.com/PufAnimalsDev/ComicShelf/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Re-run the failed workflow from [Actions](https://github.com/PufAnimalsDev/ComicShelf/actions), or push any commit to `main`.

Alternatively, after installing and logging into GitHub CLI:

```bash
gh auth login
gh api repos/PufAnimalsDev/ComicShelf/pages -X POST -f build_type=workflow
```

## License

Public catalog data is for personal collection tracking. Marvel characters and titles are property of Marvel Entertainment.
