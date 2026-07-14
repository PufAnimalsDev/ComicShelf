window.ComicShelfStorage = (() => {
  const ACTIVE_CATALOG_KEY = 'comicshelf-active-catalog-v1';
  const LEGACY_OWNED_KEYS = ['comicshelf-owned-v1', 'marvel-comics-owned-v2', 'marvel-now-owned-v1'];
  const LEGACY_READ_KEYS = ['comicshelf-read-v1', 'marvel-comics-read-v1'];

  function ownedKey(catalogId) {
    return `comicshelf-owned-v1-${catalogId}`;
  }

  function readKey(catalogId) {
    return `comicshelf-read-v1-${catalogId}`;
  }

  function userStateKey(catalogId) {
    return `comicshelf-user-state-v1-${catalogId}`;
  }

  function readJsonFromRaw(raw) {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function findLegacyOwned() {
    for (const key of LEGACY_OWNED_KEYS) {
      const value = localStorage.getItem(key);
      if (value) return value;
    }
    return null;
  }

  function findLegacyRead() {
    for (const key of LEGACY_READ_KEYS) {
      const value = localStorage.getItem(key);
      if (value) return value;
    }
    return null;
  }

  function sanitizeIds(ids, validIds) {
    return [...new Set(ids)].filter((id) => validIds.has(id));
  }

  function hasUserState(catalogId) {
    return localStorage.getItem(userStateKey(catalogId)) === '1';
  }

  function hasStoredState(catalogId) {
    return localStorage.getItem(ownedKey(catalogId)) !== null;
  }

  function shouldApplySeed(catalogId) {
    return !hasUserState(catalogId) && !hasStoredState(catalogId);
  }

  function loadActiveCatalog() {
    const saved = localStorage.getItem(ACTIVE_CATALOG_KEY);
    if (saved && window.ComicShelfCatalog[saved]) return saved;
    return window.ComicShelfActiveCatalog || 'marvel-pl';
  }

  function saveActiveCatalog(catalogId) {
    localStorage.setItem(ACTIVE_CATALOG_KEY, catalogId);
  }

  function loadState(catalogId, validIds) {
    let ownedRaw = localStorage.getItem(ownedKey(catalogId));
    let readRaw = localStorage.getItem(readKey(catalogId));
    let migrated = false;

    if (!ownedRaw && catalogId === 'marvel-pl') {
      const legacyOwned = findLegacyOwned();
      if (legacyOwned) {
        ownedRaw = legacyOwned;
        migrated = true;
      }
    }

    if (!readRaw && catalogId === 'marvel-pl') {
      const legacyRead = findLegacyRead();
      if (legacyRead) {
        readRaw = legacyRead;
        migrated = true;
      }
    }

    const owned = new Set(sanitizeIds(readJsonFromRaw(ownedRaw), validIds));
    const read = new Set(sanitizeIds(readJsonFromRaw(readRaw), validIds));

    if (migrated) {
      saveState(catalogId, owned, read, { user: true });
    }

    return { owned, read };
  }

  function saveState(catalogId, owned, read, options = {}) {
    const { user = true } = options;
    localStorage.setItem(ownedKey(catalogId), JSON.stringify([...owned]));
    localStorage.setItem(readKey(catalogId), JSON.stringify([...read]));
    if (user) {
      localStorage.setItem(userStateKey(catalogId), '1');
    }
  }

  return {
    loadActiveCatalog,
    saveActiveCatalog,
    loadState,
    saveState,
    hasUserState,
    hasStoredState,
    shouldApplySeed,
  };
})();
