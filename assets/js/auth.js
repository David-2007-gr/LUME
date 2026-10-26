(function () {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');
  const displayNameInput = document.getElementById('displayName');
  const passwordInput = document.getElementById('password');

  function normalizeName(value) {
    return value.trim().replace(/\s+/g, ' ');
  }

  function continueToHome(session) {
    const saved = Lume.setSession(session);
    const params = new URLSearchParams();

    if (!saved) {
      if (session.guest) {
        params.set('visitante', session.displayName);
      } else {
        params.set('usuario', session.displayName);
      }

      if (session.showTemporaryNotice) params.set('aviso', '1');
    }

    location.href = 'inicio.html' + (params.toString() ? '?' + params.toString() : '');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    message.textContent = '';

    const displayName = normalizeName(displayNameInput.value);
    const password = passwordInput.value;

    if (displayName.length < 2) {
      message.textContent = 'Digite um nome para ser exibido na plataforma.';
      displayNameInput.focus();
      return;
    }

    if (password.length < 8) {
      message.textContent = 'A senha precisa ter pelo menos 8 caracteres.';
      passwordInput.focus();
      return;
    }

    const normalizedKey = displayName.toLowerCase();
    const users = Lume.getUsers();
    const existingUser = users[normalizedKey];

    if (existingUser && existingUser.password !== password) {
      message.textContent = 'Essa senha não corresponde a esse nome. Confira e tente novamente.';
      passwordInput.focus();
      return;
    }

    if (!existingUser) {
      users[normalizedKey] = {
        password,
        displayName,
        createdAt: new Date().toISOString(),
        noticeShown: false
      };
    }

    const showTemporaryNotice = users[normalizedKey].noticeShown !== true;
    users[normalizedKey].noticeShown = true;
    Lume.saveUsers(users);

    continueToHome({
      username: displayName,
      displayName,
      guest: false,
      showTemporaryNotice
    });
  });

  document.getElementById('guestButton').addEventListener('click', () => {
    const promptName = window.prompt('Como você gostaria de ser chamado hoje?', 'Visitante');

    const displayName = normalizeName(promptName || '');
    const finalName = displayName.length >= 2 ? displayName : 'Visitante';

    continueToHome({
      username: finalName,
      displayName: finalName,
      guest: true,
      createdAt: new Date().toISOString()
    });
  });
})();