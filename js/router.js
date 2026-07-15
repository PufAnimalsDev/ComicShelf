window.ComicShelfRouter = (() => {
  const views = {
    auth: 'authView',
    home: 'homeView',
    catalog: 'catalogView',
    collection: 'collectionView',
  };

  const HOME_ROUTE = { view: 'home' };

  function showView(name) {
    for (const [viewName, elementId] of Object.entries(views)) {
      document.getElementById(elementId).hidden = viewName !== name;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.hidden = name === 'auth';
    }
  }

  function buildHash(route) {
    if (route.view === 'home') return '#/';
    if (route.view === 'catalog') return `#/catalog/${route.catalogId}`;
    if (route.view === 'series') {
      return `#/series/${route.catalogId}/${encodeURIComponent(route.collectionName)}`;
    }
    return '#/';
  }

  function parseHash() {
    const raw = location.hash.slice(1).replace(/^\/?/, '');
    if (!raw) return { ...HOME_ROUTE };

    const segments = raw.split('/');
    const [kind, catalogId, ...rest] = segments;

    if (kind === 'catalog' && catalogId && isValidCatalog(catalogId)) {
      return { view: 'catalog', catalogId };
    }

    if (kind === 'series' && catalogId && rest.length && isValidCatalog(catalogId)) {
      const collectionName = decodeURIComponent(rest.join('/'));
      if (isValidSeries(catalogId, collectionName)) {
        return { view: 'series', catalogId, collectionName };
      }
      return { view: 'catalog', catalogId };
    }

    return { ...HOME_ROUTE };
  }

  function isValidCatalog(catalogId) {
    return Boolean(window.ComicShelfCatalog[catalogId]);
  }

  function isValidSeries(catalogId, collectionName) {
    const meta = window.ComicShelfCatalog[catalogId];
    const comics = window[meta.dataKey] || [];
    return comics.some((x) => x.collection === collectionName);
  }

  function applyRoute(route) {
    switch (route.view) {
      case 'catalog':
        window.ComicShelfApp.closeCollection();
        window.ComicShelfSeriesHome.render(route.catalogId);
        showView('catalog');
        break;
      case 'series':
        window.ComicShelfApp.openCollection(route.catalogId, route.collectionName);
        showView('collection');
        break;
      case 'home':
      default:
        window.ComicShelfApp.closeCollection();
        window.ComicShelfHome.render();
        showView('home');
        break;
    }
  }

  function pushRoute(route) {
    history.pushState(route, '', buildHash(route));
    applyRoute(route);
  }

  function seedHistory(route) {
    history.replaceState(HOME_ROUTE, '', buildHash(HOME_ROUTE));
    if (route.view === 'series') {
      const catalogRoute = { view: 'catalog', catalogId: route.catalogId };
      history.pushState(catalogRoute, '', buildHash(catalogRoute));
    }
    if (route.view !== 'home') {
      history.pushState(route, '', buildHash(route));
    }
    applyRoute(route);
  }

  async function enterApp() {
    await window.ComicShelfBootstrap.applySeedIfNeeded();
    window.ComicShelfHome.init();
    seedHistory(parseHash());
  }

  function openCatalog(catalogId) {
    if (!isValidCatalog(catalogId)) return;
    pushRoute({ view: 'catalog', catalogId });
  }

  function openCollection(catalogId, collectionName) {
    if (!isValidSeries(catalogId, collectionName)) return;
    pushRoute({ view: 'series', catalogId, collectionName });
  }

  function goHome() {
    history.back();
  }

  function goCatalog() {
    history.back();
  }

  function logout() {
    window.ComicShelfApp.closeCollection();
    window.ComicShelfAuth.logout();
    history.replaceState(null, '', location.pathname + location.search);
    showView('auth');
    document.getElementById('authPassword').value = '';
    document.getElementById('authError').hidden = true;
  }

  function bindHistory() {
    window.addEventListener('popstate', () => {
      if (!window.ComicShelfAuth.isAuthenticated()) {
        showView('auth');
        return;
      }
      applyRoute(history.state || parseHash());
    });
  }

  function bindAuthForm() {
    const form = document.getElementById('authForm');
    const passwordInput = document.getElementById('authPassword');
    const errorEl = document.getElementById('authError');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.hidden = true;

      try {
        const ok = await window.ComicShelfAuth.login(passwordInput.value);
        if (!ok) {
          errorEl.textContent = 'Nieprawidłowe hasło.';
          errorEl.hidden = false;
          return;
        }

        passwordInput.value = '';
        await enterApp();
      } catch (err) {
        errorEl.textContent =
          err.message === 'AUTH_NOT_CONFIGURED'
            ? 'Hasło nie jest skonfigurowane. Uruchom scripts/set-password.js.'
            : 'Nie udało się zalogować.';
        errorEl.hidden = false;
      }
    });
  }

  function init() {
    bindHistory();
    document.getElementById('backToHomeBtn').addEventListener('click', goHome);
    document.getElementById('backToCatalogBtn').addEventListener('click', goCatalog);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    bindAuthForm();

    if (window.ComicShelfAuth.isAuthenticated()) {
      enterApp();
    } else {
      showView('auth');
    }
  }

  return {
    showView,
    openCatalog,
    openCollection,
    goHome,
    goCatalog,
    logout,
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.ComicShelfRouter.init();
});
