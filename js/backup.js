window.ComicShelfBackup = (() => {
  const APP_NAME = 'ComicShelf';
  const VERSION_SINGLE = 4;
  const VERSION_ALL = 5;

  function formatDate(iso) {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function fileDate(iso) {
    const date = new Date(iso || Date.now());
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getValidIds(catalogId) {
    const meta = window.ComicShelfCatalog[catalogId];
    if (!meta) return new Set();
    const comics = window[meta.dataKey] || [];
    return new Set(comics.map((x) => x.id));
  }

  function filterState(ownedRaw, readRaw, validIds) {
    const ownedBefore = ownedRaw.length;
    const readBefore = readRaw.length;
    const owned = new Set(ownedRaw.filter((id) => validIds.has(id)));
    const read = new Set(readRaw.filter((id) => validIds.has(id)));

    return {
      owned,
      read,
      stats: {
        owned: owned.size,
        read: read.size,
        skippedOwned: ownedBefore - owned.size,
        skippedRead: readBefore - read.size,
        skippedTotal: ownedBefore - owned.size + (readBefore - read.size),
      },
    };
  }

  function exportBackup({ owned, read, catalogId }) {
    const generatedAt = new Date().toISOString();
    const payload = {
      app: APP_NAME,
      catalog: catalogId,
      version: VERSION_SINGLE,
      generatedAt,
      owned: [...owned],
      read: [...read],
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    return {
      blob,
      filename: `comicshelf-${catalogId}-${fileDate(generatedAt)}.json`,
    };
  }

  function exportAllBackup() {
    const generatedAt = new Date().toISOString();
    const catalogs = {};

    for (const catalogId of Object.keys(window.ComicShelfCatalog)) {
      const validIds = getValidIds(catalogId);
      const { owned, read } = window.ComicShelfStorage.loadState(catalogId, validIds);
      catalogs[catalogId] = {
        owned: [...owned],
        read: [...read],
      };
    }

    const payload = {
      app: APP_NAME,
      version: VERSION_ALL,
      generatedAt,
      catalogs,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    return {
      blob,
      filename: `comicshelf-all-${fileDate(generatedAt)}.json`,
    };
  }

  function downloadBackup(options) {
    const { blob, filename } = exportBackup(options);
    triggerDownload(blob, filename);
  }

  function downloadAllBackup() {
    const { blob, filename } = exportAllBackup();
    triggerDownload(blob, filename);
  }

  function triggerDownload(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function parseJson(jsonText) {
    try {
      return JSON.parse(jsonText);
    } catch {
      throw new Error('INVALID_JSON');
    }
  }

  function isMultiFormat(data) {
    return Boolean(data && data.catalogs && typeof data.catalogs === 'object');
  }

  function parseBackup(jsonText, validIds, catalogId = null) {
    const data = parseJson(jsonText);

    if (isMultiFormat(data)) {
      if (!catalogId) {
        throw new Error('CATALOG_REQUIRED');
      }

      const entry = data.catalogs[catalogId];
      if (!entry) {
        throw new Error('CATALOG_NOT_FOUND');
      }

      const ownedRaw = entry.owned || [];
      const readRaw = entry.read || [];

      if (!Array.isArray(ownedRaw)) throw new Error('INVALID_OWNED');
      if (!Array.isArray(readRaw)) throw new Error('INVALID_READ');

      const filtered = filterState(ownedRaw, readRaw, validIds);

      return {
        ...filtered,
        generatedAt: data.generatedAt || data.exportedAt || null,
      };
    }

    const isLegacyArray = Array.isArray(data);
    const ownedRaw = isLegacyArray ? data : data.owned;
    const readRaw = isLegacyArray ? [] : data.read || [];

    if (!Array.isArray(ownedRaw)) {
      throw new Error('INVALID_OWNED');
    }

    if (!isLegacyArray && readRaw && !Array.isArray(readRaw)) {
      throw new Error('INVALID_READ');
    }

    const generatedAt = isLegacyArray
      ? null
      : data.generatedAt || data.exportedAt || null;

    const filtered = filterState(ownedRaw, readRaw, validIds);

    return {
      ...filtered,
      generatedAt,
    };
  }

  function parseAllBackup(jsonText) {
    const data = parseJson(jsonText);
    const generatedAt = data.generatedAt || data.exportedAt || null;
    const results = {};
    const totals = {
      owned: 0,
      read: 0,
      skippedTotal: 0,
      catalogCount: 0,
    };

    if (isMultiFormat(data)) {
      for (const catalogId of Object.keys(window.ComicShelfCatalog)) {
        const entry = data.catalogs[catalogId];
        if (!entry) continue;

        const validIds = getValidIds(catalogId);
        const ownedRaw = entry.owned || [];
        const readRaw = entry.read || [];

        if (!Array.isArray(ownedRaw) || !Array.isArray(readRaw)) {
          throw new Error('INVALID_CATALOG_ENTRY');
        }

        const filtered = filterState(ownedRaw, readRaw, validIds);
        results[catalogId] = filtered;
        totals.owned += filtered.stats.owned;
        totals.read += filtered.stats.read;
        totals.skippedTotal += filtered.stats.skippedTotal;
        totals.catalogCount += 1;
      }

      return { results, generatedAt, totals, format: 'multi' };
    }

    const isLegacyArray = Array.isArray(data);
    const targetCatalogId = isLegacyArray
      ? 'marvel-pl'
      : data.catalog || 'marvel-pl';

    if (!window.ComicShelfCatalog[targetCatalogId]) {
      throw new Error('CATALOG_NOT_FOUND');
    }

    const validIds = getValidIds(targetCatalogId);
    const single = parseBackup(jsonText, validIds, null);

    results[targetCatalogId] = single;
    totals.owned = single.stats.owned;
    totals.read = single.stats.read;
    totals.skippedTotal = single.stats.skippedTotal;
    totals.catalogCount = 1;

    return {
      results,
      generatedAt,
      totals,
      format: 'single',
      targetCatalogId,
    };
  }

  function applyAllBackup(parsed, options = {}) {
    const { user = true } = options;
    for (const [catalogId, result] of Object.entries(parsed.results)) {
      window.ComicShelfStorage.saveState(catalogId, result.owned, result.read, { user });
    }
  }

  function importMessage(result) {
    const parts = [];
    const formattedDate = formatDate(result.generatedAt);

    if (formattedDate) {
      parts.push(`Wczytano kopię z ${formattedDate}.`);
    } else {
      parts.push('Wczytano kopię JSON.');
    }

    parts.push(`Posiadane: ${result.stats.owned}, przeczytane: ${result.stats.read}.`);

    if (result.stats.skippedTotal > 0) {
      parts.push(`Pominięto ${result.stats.skippedTotal} nieznanych ID.`);
    }

    return parts.join(' ');
  }

  function importAllMessage(parsed) {
    const parts = [];
    const formattedDate = formatDate(parsed.generatedAt);

    if (formattedDate) {
      parts.push(`Wczytano kopię z ${formattedDate}.`);
    } else {
      parts.push('Wczytano kopię JSON.');
    }

    if (parsed.format === 'multi') {
      for (const [catalogId, result] of Object.entries(parsed.results)) {
        const name = window.ComicShelfCatalog[catalogId]?.name || catalogId;
        parts.push(
          `${name}: ${result.stats.owned} posiadanych, ${result.stats.read} przeczytanych.`
        );
      }
    } else {
      const catalogId = parsed.targetCatalogId;
      const name = window.ComicShelfCatalog[catalogId]?.name || catalogId;
      const result = parsed.results[catalogId];
      parts.push(
        `${name}: ${result.stats.owned} posiadanych, ${result.stats.read} przeczytanych.`
      );
    }

    if (parsed.totals.skippedTotal > 0) {
      parts.push(`Pominięto ${parsed.totals.skippedTotal} nieznanych ID.`);
    }

    return parts.join(' ');
  }

  return {
    exportBackup,
    exportAllBackup,
    downloadBackup,
    downloadAllBackup,
    parseBackup,
    parseAllBackup,
    applyAllBackup,
    importMessage,
    importAllMessage,
  };
})();
