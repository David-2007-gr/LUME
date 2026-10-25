(function () {
  const STORAGE_KEYS = {
    fontSize: 'lume.fontSize',
    fontFamily: 'lume.fontFamily',
    theme: 'lume.theme',
    users: 'lume.users',
    session: 'lume.session'
  };

  const FONT_SIZES = {
    small: 18,
    medium: 20,
    large: 24,
    xlarge: 29
  };

  const FONT_FAMILIES = {
    default: {
      body: 'Arial, Helvetica, sans-serif',
      heading: '"Times New Roman", Times, serif',
      reading: '"Times New Roman", Times, serif'
    },
    times: {
      body: '"Times New Roman", Times, serif',
      heading: '"Times New Roman", Times, serif',
      reading: '"Times New Roman", Times, serif'
    },
    georgia: {
      body: 'Georgia, serif',
      heading: 'Georgia, serif',
      reading: 'Georgia, serif'
    },
    verdana: {
      body: 'Verdana, Geneva, sans-serif',
      heading: 'Verdana, Geneva, sans-serif',
      reading: 'Verdana, Geneva, sans-serif'
    }
  };

  const colorScheme = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  function readStored(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) return value;
    } catch (_) {}

    try {
      const value = sessionStorage.getItem(key);
      if (value !== null) return value;
    } catch (_) {}

    return null;
  }

  function writeStored(key, value) {
    let saved = false;

    try {
      localStorage.setItem(key, value);
      saved = true;
    } catch (_) {}

    try {
      sessionStorage.setItem(key, value);
      saved = true;
    } catch (_) {}

    return saved;
  }

  function removeStored(key) {
    try {
      localStorage.removeItem(key);
    } catch (_) {}

    try {
      sessionStorage.removeItem(key);
    } catch (_) {}
  }

  function getFontSize() {
    const value = readStored(STORAGE_KEYS.fontSize);
    return FONT_SIZES[value] ? value : 'large';
  }

  function setFontSize(value) {
    if (!FONT_SIZES[value]) return false;

    writeStored(STORAGE_KEYS.fontSize, value);
    document.documentElement.style.setProperty('--base-font-size', FONT_SIZES[value] + 'px');
    return true;
  }

  function getFontFamily() {
    const value = readStored(STORAGE_KEYS.fontFamily);
    return FONT_FAMILIES[value] ? value : 'default';
  }

  function setFontFamily(value) {
    const family = FONT_FAMILIES[value];
    if (!family) return false;

    writeStored(STORAGE_KEYS.fontFamily, value);
    const root = document.documentElement;
    root.style.setProperty('--page-font-family', family.body);
    root.style.setProperty('--heading-font-family', family.heading);
    root.style.setProperty('--reading-font-family', family.reading);
    return true;
  }

  function getThemeMode() {
    const value = readStored(STORAGE_KEYS.theme);
    return ['auto', 'light', 'dark'].includes(value) ? value : 'auto';
  }

  function getDetectedTheme() {
    return colorScheme && colorScheme.matches ? 'dark' : 'light';
  }

  function setThemeMode(value) {
    if (!['auto', 'light', 'dark'].includes(value)) return false;

    writeStored(STORAGE_KEYS.theme, value);
    document.documentElement.dataset.theme = value;
    updateThemeStatus();
    return true;
  }

  function updateThemeStatus() {
    const status = document.getElementById('themeStatus');
    if (!status) return;

    const mode = getThemeMode();
    if (mode === 'auto') {
      status.textContent = 'Tema do navegador detectado: ' + (getDetectedTheme() === 'dark' ? 'escuro.' : 'claro.');
    } else {
      status.textContent = 'Tema escolhido: ' + (mode === 'dark' ? 'escuro.' : 'claro.') + ' O modo automático acompanha o navegador.';
    }
  }

  function applyPreferences() {
    setFontSize(getFontSize());
    setFontFamily(getFontFamily());
    document.documentElement.dataset.theme = getThemeMode();
  }

  function getUsers() {
    try {
      return JSON.parse(readStored(STORAGE_KEYS.users) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveUsers(users) {
    return writeStored(STORAGE_KEYS.users, JSON.stringify(users));
  }

  function setSession(session) {
    return writeStored(STORAGE_KEYS.session, JSON.stringify(session));
  }

  function getSession() {
    try {
      return JSON.parse(readStored(STORAGE_KEYS.session) || 'null');
    } catch (_) {
      return null;
    }
  }

  function clearSession() {
    removeStored(STORAGE_KEYS.session);
  }

  function makeGuestName() {
    let suffix;

    try {
      const bytes = new Uint8Array(3);
      crypto.getRandomValues(bytes);
      suffix = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch (_) {
      suffix = Math.random().toString(16).slice(2, 8).toUpperCase();
    }

    return 'Visitante-' + suffix;
  }

  function addReadingMenu() {
    if (document.getElementById('readingMenu')) return;

    const menu = document.createElement('details');
    const onSecondaryPage = location.pathname.includes('/pages/');
    const accessibilityPath = onSecondaryPage ? 'acessibilidade.html' : 'pages/acessibilidade.html';

    menu.id = 'readingMenu';
    menu.className = 'reading-menu';
    menu.innerHTML = `
      <summary>Opções de leitura</summary>
      <div class="reading-menu-panel">
        <label for="fontFamilySelect">Tipo de letra</label>
        <select id="fontFamilySelect">
          <option value="default">Padrão (Arial e Times New Roman)</option>
          <option value="times">Times New Roman</option>
          <option value="georgia">Georgia</option>
          <option value="verdana">Verdana</option>
        </select>
        <label for="themeSelect">Aparência</label>
        <select id="themeSelect">
          <option value="auto">Automática (seguir o navegador)</option>
          <option value="light">Modo claro</option>
          <option value="dark">Modo escuro</option>
        </select>
        <p id="themeStatus" aria-live="polite"></p>
        <p>As preferências são aplicadas em todas as páginas neste navegador.</p>
        <a href="${accessibilityPath}">Alterar tamanho da letra</a>
      </div>`;

    document.body.appendChild(menu);

    const fontFamilySelect = menu.querySelector('#fontFamilySelect');
    const themeSelect = menu.querySelector('#themeSelect');

    fontFamilySelect.value = getFontFamily();
    themeSelect.value = getThemeMode();

    fontFamilySelect.addEventListener('change', () => setFontFamily(fontFamilySelect.value));
    themeSelect.addEventListener('change', () => setThemeMode(themeSelect.value));
    updateThemeStatus();
  }

  window.Lume = {
    fontPixels: value => FONT_SIZES[value] || FONT_SIZES.large,
    getFontSize,
    setFontSize,
    getFontFamily,
    setFontFamily,
    getThemeMode,
    getDetectedTheme,
    setThemeMode,
    applyPreferences,
    getUsers,
    saveUsers,
    setSession,
    getSession,
    clearSession,
    makeGuestName
  };

  applyPreferences();

  if (colorScheme) {
    const handleSchemeChange = () => {
      if (getThemeMode() === 'auto') updateThemeStatus();
    };

    if (typeof colorScheme.addEventListener === 'function') {
      colorScheme.addEventListener('change', handleSchemeChange);
    } else if (typeof colorScheme.addListener === 'function') {
      colorScheme.addListener(handleSchemeChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addReadingMenu, { once: true });
  } else {
    addReadingMenu();
  }
})();
