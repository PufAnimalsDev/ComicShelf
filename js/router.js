window.ComicShelfRouter = (() => {
  const views = {
    auth: 'authView',
    home: 'homeView',
    catalog: 'catalogView',
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

  function openCatalog(catalogId) {
    window.ComicShelfApp.openCatalog(catalogId);
    showView('catalog');
  }

  function goHome() {
    window.ComicShelfApp.closeCatalog();
    window.ComicShelfHome.render();
    showView('home');
  }

  function logout() {
    window.ComicShelfApp.closeCatalog();
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
        window.ComicShelfHome.init();
        showView('home');
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
    document.getElementById('logoutBtn').addEventListener('click', logout);
    bindAuthForm();

    if (window.ComicShelfAuth.isAuthenticated()) {
      window.ComicShelfHome.init();
      showView('home');
    } else {
      showView('auth');
    }
  }

  return {
    showView,
    openCatalog,
    goHome,
    logout,
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.ComicShelfRouter.init();
});
