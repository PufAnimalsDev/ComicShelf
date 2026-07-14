window.ComicShelfBootstrap = (() => {
  const build = window.ComicShelfBuild;
  const SEED_URL =
    build && build !== 'dev'
      ? `data/initial-state.json?v=${build}`
      : 'data/initial-state.json';

  async function applySeedIfNeeded() {
    let response;
    try {
      response = await fetch(SEED_URL);
    } catch {
      return { applied: [], skipped: [] };
    }

    if (!response.ok) {
      return { applied: [], skipped: [] };
    }

    let parsed;
    try {
      parsed = window.ComicShelfBackup.parseAllBackup(await response.text());
    } catch {
      return { applied: [], skipped: [] };
    }

    const applied = [];
    const skipped = [];

    for (const catalogId of Object.keys(window.ComicShelfCatalog)) {
      if (!window.ComicShelfStorage.shouldApplySeed(catalogId)) {
        skipped.push(catalogId);
        continue;
      }

      const result = parsed.results[catalogId];
      if (!result) {
        skipped.push(catalogId);
        continue;
      }

      window.ComicShelfStorage.saveState(catalogId, result.owned, result.read, {
        user: false,
      });
      applied.push(catalogId);
    }

    return { applied, skipped };
  }

  return { applySeedIfNeeded };
})();
