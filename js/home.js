window.ComicShelfHome = (() => {
  let eventsBound = false;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]
    );
  }

  function getCatalogStats(meta) {
    const comics = window[meta.dataKey] || [];
    const validIds = new Set(comics.map((x) => x.id));
    const { owned } = window.ComicShelfStorage.loadState(meta.id, validIds);
    const total = comics.length;
    const ownedCount = owned.size;
    const percent = total ? Math.round((ownedCount / total) * 100) : 0;

    return { total, ownedCount, percent };
  }

  function render() {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = '';

    for (const meta of Object.values(window.ComicShelfCatalog)) {
      const stats = getCatalogStats(meta);
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'catalog-tile';
      tile.innerHTML = `<div class="catalog-tile-title">${escapeHtml(meta.name)}</div><div class="catalog-tile-desc">${escapeHtml(meta.description)}</div><div class="catalog-tile-stats"><strong>${stats.ownedCount}</strong> / ${stats.total} posiadanych · ${stats.percent}%</div><div class="progress"><div style="width:${stats.percent}%"></div></div>`;
      tile.addEventListener('click', () => window.ComicShelfRouter.openCatalog(meta.id));
      grid.appendChild(tile);
    }
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    document.getElementById('exportAllBtn').addEventListener('click', () => {
      window.ComicShelfBackup.downloadAllBackup();
    });

    document.getElementById('importAllBtn').addEventListener('click', () => {
      document.getElementById('importAllFile').click();
    });

    document.getElementById('importAllFile').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const parsed = window.ComicShelfBackup.parseAllBackup(await file.text());
        window.ComicShelfBackup.applyAllBackup(parsed);
        render();
        alert(window.ComicShelfBackup.importAllMessage(parsed));
      } catch {
        alert('Nieprawidłowy plik kopii.');
      }

      e.target.value = '';
    });
  }

  function init() {
    bindEvents();
    render();
  }

  return { render, init };
})();
