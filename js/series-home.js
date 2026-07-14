window.ComicShelfSeriesHome = (() => {
  let catalogId = null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]
    );
  }

  function getSeriesStats(comics, collectionName, owned) {
    const seriesComics = comics.filter((x) => x.collection === collectionName);
    const total = seriesComics.length;
    const ownedCount = seriesComics.filter((x) => owned.has(x.id)).length;
    const percent = total ? Math.round((ownedCount / total) * 100) : 0;
    return { total, ownedCount, percent };
  }

  function render(nextCatalogId) {
    catalogId = nextCatalogId;
    const meta = window.ComicShelfCatalog[catalogId];
    const comics = window[meta.dataKey] || [];
    const validIds = new Set(comics.map((x) => x.id));
    const { owned } = window.ComicShelfStorage.loadState(catalogId, validIds);

    document.getElementById('catalogTitle').textContent = meta.name;

    const grid = document.getElementById('seriesGrid');
    grid.innerHTML = '';

    const seriesNames = [...new Set(comics.map((x) => x.collection))].sort((a, b) =>
      a.localeCompare(b, 'pl')
    );

    for (const collectionName of seriesNames) {
      const stats = getSeriesStats(comics, collectionName, owned);
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'catalog-tile';
      tile.innerHTML = `<div class="catalog-tile-title">${escapeHtml(collectionName)}</div><div class="catalog-tile-stats"><strong>${stats.ownedCount}</strong> / ${stats.total} posiadanych · ${stats.percent}%</div><div class="progress"><div style="width:${stats.percent}%"></div></div>`;
      tile.addEventListener('click', () =>
        window.ComicShelfRouter.openCollection(catalogId, collectionName)
      );
      grid.appendChild(tile);
    }
  }

  function getCatalogId() {
    return catalogId;
  }

  return { render, getCatalogId };
})();
