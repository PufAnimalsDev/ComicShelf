window.ComicShelfAuth = (() => {
  const SESSION_KEY = 'comicshelf-auth-v1';

  async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function createSessionToken() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function isAuthenticated() {
    return Boolean(sessionStorage.getItem(SESSION_KEY));
  }

  async function login(password) {
    const hash = await hashPassword(password);
    const expected = window.ComicShelfAuthConfig?.PASSWORD_HASH || '';

    if (!expected) {
      throw new Error('AUTH_NOT_CONFIGURED');
    }

    if (hash !== expected) {
      return false;
    }

    sessionStorage.setItem(SESSION_KEY, createSessionToken());
    return true;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  return {
    isAuthenticated,
    login,
    logout,
  };
})();
