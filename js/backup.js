window.ComicShelfBackup = (() => {
  const APP_NAME = 'ComicShelf';
  const VERSION = 4;

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

  function exportBackup({ owned, read, catalogId }) {
    const generatedAt = new Date().toISOString();
    const payload = {
      app: APP_NAME,
      catalog: catalogId,
      version: VERSION,
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

  function downloadBackup(options) {
    const { blob, filename } = exportBackup(options);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function parseBackup(jsonText, validIds) {
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      throw new Error('INVALID_JSON');
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

    const ownedBefore = ownedRaw.length;
    const readBefore = readRaw.length;

    const owned = new Set(ownedRaw.filter((id) => validIds.has(id)));
    const read = new Set(readRaw.filter((id) => validIds.has(id)));

    const skippedOwned = ownedBefore - owned.size;
    const skippedRead = readBefore - read.size;

    return {
      owned,
      read,
      generatedAt,
      stats: {
        owned: owned.size,
        read: read.size,
        skippedOwned,
        skippedRead,
        skippedTotal: skippedOwned + skippedRead,
      },
    };
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

  return {
    exportBackup,
    downloadBackup,
    parseBackup,
    importMessage,
  };
})();
