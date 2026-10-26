(function () {
  document.querySelectorAll('.card-icon').forEach(image => {
    const hideMissingImage = () => {
      image.hidden = true;
    };

    image.addEventListener('error', hideMissingImage, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      hideMissingImage();
    }
  });

  const params = new URLSearchParams(location.search);
  let user = Lume.getSession();

  if (!user && params.has('visitante')) {
    user = {
      username: params.get('visitante'),
      displayName: params.get('visitante'),
      guest: true
    };
  }

  if (!user && params.has('usuario')) {
    user = {
      username: params.get('usuario'),
      displayName: params.get('usuario'),
      guest: false
    };
  }

  if (user && user.displayName && !Lume.getSession()) {
    Lume.setSession(user);
  }

  const greeting = document.getElementById('greeting');
  const displayName = user && (user.displayName || user.username);

  greeting.textContent = displayName
    ? 'Olá, ' + displayName + '! Vamos aprender juntos?'
    : 'Olá! Vamos aprender juntos?';

  const notice = document.getElementById('temporaryNotice');
  const shouldShowNotice = Boolean(
    (user && user.showTemporaryNotice) || params.get('aviso') === '1'
  );

  if (shouldShowNotice) {
    notice.hidden = false;

    if (user && user.showTemporaryNotice) {
      user.showTemporaryNotice = false;
      Lume.setSession(user);
    }

    if (params.has('aviso')) {
      history.replaceState(null, '', location.pathname);
    }
  }

  document.getElementById('dismissNotice').addEventListener('click', () => {
    notice.hidden = true;
  });

  document.getElementById('logoutButton').addEventListener('click', () => {
    Lume.clearSession();
    location.href = 'login.html';
  });
})();