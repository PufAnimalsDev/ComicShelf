window.ComicShelfRouter = (() => {
  const views = {
    auth: 'authView',
    home: 'homeView',
    catalog: 'catalogView',
    collection: 'collectionView',
  };

  function showView(name) {
    for (const [viewName, elementId] of Object.entries(views)) {
      document.getElementById(elementId).hidden = viewName !== name;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.hidden = name === 'auth';
    }
  }

  async function enterApp() {
    await window.ComicShelfBootstrap.applySeedIfNeeded();
    window.ComicShelfHome.init();
    showView('home');
  }

  function openCatalog(catalogId) {
    window.ComicShelfSeriesHome.render(catalogId);
    showView('catalog');
  }

  function openCollection(catalogId, collectionName) {
    window.ComicShelfApp.openCollection(catalogId, collectionName);
    showView('collection');
  }

  function goHome() {
    window.ComicShelfApp.closeCollection();
    window.ComicShelfHome.render();
    showView('home');
  }

  function goCatalog() {
    window.ComicShelfApp.closeCollection();
    const catalogId = window.ComicShelfSeriesHome.getCatalogId();
    if (catalogId) {
      window.ComicShelfSeriesHome.render(catalogId);
    }
    showView('catalog');
  }

  function logout() {
    window.ComicShelfApp.closeCollection();
    window.ComicShelfAuth.logout();
    showView('auth');
    document.getElementById('authPassword').value = '';
    document.getElementById('authError').hidden = true;
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
