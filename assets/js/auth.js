(function () {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  function continueToHome(session) {
    const saved = Lume.setSession(session);
    const params = new URLSearchParams();

    if (!saved) {
      params.set(session.guest ? 'visitante' : 'usuario', session.username);
      if (session.showTemporaryNotice) params.set('aviso', '1');
    }

    location.href = 'inicio.html' + (params.toString() ? '?' + params.toString() : '');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    message.textContent = '';

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username.length < 2) {
      message.textContent = 'O nome de usuário precisa ter pelo menos 2 caracteres.';
      usernameInput.focus();
      return;
    }

    if (password.length < 8) {
      message.textContent = 'A senha precisa ter pelo menos 8 caracteres.';
      passwordInput.focus();
      return;
    }

    const users = Lume.getUsers();
    const existingUser = users[username];

    if (existingUser && existingUser.password !== password) {
      message.textContent = 'Essa senha não corresponde a esse nome. Confira e tente novamente.';
      passwordInput.focus();
      return;
    }

    if (!existingUser) {
      users[username] = {
        password,
        createdAt: new Date().toISOString(),
        noticeShown: false
      };
    }

    const showTemporaryNotice = users[username].noticeShown !== true;
    users[username].noticeShown = true;
    Lume.saveUsers(users);

    continueToHome({
      username,
      guest: false,
      showTemporaryNotice
    });
  });

  document.getElementById('guestButton').addEventListener('click', () => {
    const username = Lume.makeGuestName();
    continueToHome({
      username,
      guest: true,
      createdAt: new Date().toISOString()
    });
  });
})();
