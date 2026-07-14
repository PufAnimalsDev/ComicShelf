window.ComicShelfStorage = (() => {
  const OWNED_KEY = 'comicshelf-owned-v1';
  const READ_KEY = 'comicshelf-read-v1';
  const LEGACY_OWNED_KEYS = ['marvel-comics-owned-v2', 'marvel-now-owned-v1'];
  const LEGACY_READ_KEYS = ['marvel-comics-read-v1'];

  function readJson(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
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

  function loadState(validIds) {
    let ownedRaw = localStorage.getItem(OWNED_KEY);
    let readRaw = localStorage.getItem(READ_KEY);
    let migrated = false;

    if (!ownedRaw) {
      const legacyOwned = findLegacyOwned();
      if (legacyOwned) {
        ownedRaw = legacyOwned;
        migrated = true;
      }
    }

    if (!readRaw) {
      const legacyRead = findLegacyRead();
      if (legacyRead) {
        readRaw = legacyRead;
        migrated = true;
      }
    }

    const owned = new Set(sanitizeIds(readJsonFromRaw(ownedRaw), validIds));
    const read = new Set(sanitizeIds(readJsonFromRaw(readRaw), validIds));

    saveState(owned, read);

    return { owned, read, migrated };
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

  function saveState(owned, read) {
    localStorage.setItem(OWNED_KEY, JSON.stringify([...owned]));
    localStorage.setItem(READ_KEY, JSON.stringify([...read]));
  }

  return {
    loadState,
    saveState,
  };
})();
