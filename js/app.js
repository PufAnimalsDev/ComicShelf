window.ComicShelfApp = (() => {
  const $ = (id) => document.getElementById(id);
  const list = () => $('list');

  let catalogId = null;
  let catalogMeta = null;
  let comics = [];
  let validIds = new Set();
  let owned = new Set();
  let read = new Set();
  let eventsBound = false;

  function save() {
    window.ComicShelfStorage.saveState(catalogId, owned, read);
    stats();
  }

  function filtered() {
    const q = $('search').value.trim().toLowerCase();
    const collection = $('collection').value;
    const status = $('status').value;
    const readStatus = $('readStatus').value;

    return comics.filter(
      (x) =>
        (!collection || x.collection === collection) &&
        (!q ||
          [x.title, x.original, x.contents, x.number]
            .join(' ')
            .toLowerCase()
            .includes(q)) &&
        (status === 'all' || (status === 'owned') === owned.has(x.id)) &&
        (readStatus === 'all' || (readStatus === 'read') === read.has(x.id))
    );
  }

  function stats() {
    const ownedCount = owned.size;
    const total = comics.length;
    const percent = total ? Math.round((ownedCount / total) * 100) : 0;

    $('ownedCount').textContent = ownedCount;
    $('missingCount').textContent = total - ownedCount;
    $('readCount').textContent = read.size;
    $('unreadCount').textContent = total - read.size;
    $('percent').textContent = `${percent}%`;
    $('bar').style.width = `${percent}%`;
  }

  function render() {
    const arr = filtered();
    list().innerHTML = '';

    if (!arr.length) {
      list().innerHTML = '<div class="empty">Brak pozycji pasujących do filtrów.</div>';
      return;
    }

    for (const comic of arr) {
      const el = document.createElement('article');
      el.className =
        'comic' +
        (owned.has(comic.id) ? ' owned' : '') +
        (read.has(comic.id) ? ' read' : '');

      el.innerHTML = `<div class="checks"><label class="check-label"><input class="check owned-check" type="checkbox" ${owned.has(comic.id) ? 'checked' : ''}>Posiadam</label><label class="check-label"><input class="check read-check" type="checkbox" ${read.has(comic.id) ? 'checked' : ''}>Przeczytane</label></div><div><div class="title">${escapeHtml(comic.title)}</div><div class="meta">${escapeHtml(comic.original || '')}${comic.date ? ' · ' + escapeHtml(comic.date) : ''}</div><div class="details">${escapeHtml(comic.contents || 'Brak opisu zawartości')}</div></div><span class="badge">${escapeHtml(comic.collection)} · #${escapeHtml(comic.number)}</span>`;

      el.querySelector('.owned-check').onchange = (e) => {
        e.target.checked ? owned.add(comic.id) : owned.delete(comic.id);
        save();
        render();
      };

      el.querySelector('.read-check').onchange = (e) => {
        e.target.checked ? read.add(comic.id) : read.delete(comic.id);
        save();
        render();
      };

      list().appendChild(el);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]
    );
  }

  function populateCollectionSelect() {
    const select = $('collection');
    select.innerHTML = '<option value="">Wszystkie kolekcje</option>';
    [...new Set(comics.map((x) => x.collection))].forEach((collection) => {
      const option = document.createElement('option');
      option.value = collection;
      option.textContent = collection;
      select.appendChild(option);
    });
  }

  function resetFilters() {
    $('search').value = '';
    $('collection').value = '';
    $('status').value = 'all';
    $('readStatus').value = 'all';
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    ['search', 'collection', 'status', 'readStatus'].forEach((id) =>
      $(id).addEventListener(id === 'search' ? 'input' : 'change', render)
    );

    $('resetBtn').onclick = () => {
      if (confirm('Na pewno usunąć wszystkie oznaczenia posiadania i przeczytania?')) {
        owned.clear();
        read.clear();
        save();
        render();
      }
    };

    $('exportBtn').onclick = () => {
      window.ComicShelfBackup.downloadBackup({
        owned,
        read,
        catalogId: catalogMeta.id,
      });
    };

    $('importBtn').onclick = () => $('importFile').click();

    $('importFile').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const result = window.ComicShelfBackup.parseBackup(
          await file.text(),
          validIds,
          catalogId
        );
        owned = result.owned;
        read = result.read;
        save();
        render();
        alert(window.ComicShelfBackup.importMessage(result));
      } catch {
        alert('Nieprawidłowy plik kopii.');
      }

      e.target.value = '';
    };
  }

  function openCatalog(nextCatalogId) {
    catalogId = nextCatalogId;
    catalogMeta = window.ComicShelfCatalog[catalogId];
    comics = window[catalogMeta.dataKey] || [];
    validIds = new Set(comics.map((x) => x.id));
    ({ owned, read } = window.ComicShelfStorage.loadState(catalogId, validIds));
    window.ComicShelfStorage.saveActiveCatalog(catalogId);

    $('catalogTitle').textContent = catalogMeta.name;
    populateCollectionSelect();
    resetFilters();
    bindEvents();
    stats();
    render();
  }

  function closeCatalog() {
    if (catalogId) {
      window.ComicShelfStorage.saveState(catalogId, owned, read);
    }
  }

  return {
    openCatalog,
    closeCatalog,
  };
})();
