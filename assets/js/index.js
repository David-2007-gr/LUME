(function () {
  const startButton = document.getElementById('startButton');
  const image = document.getElementById('fontsizeImage');
  const fallback = document.getElementById('imageFallback');

  image.addEventListener('load', () => {
    fallback.hidden = true;
  });

  image.addEventListener('error', () => {
    image.hidden = true;
    fallback.hidden = false;
  });

  if (image.complete && image.naturalWidth > 0) {
    fallback.hidden = true;
  } else if (image.complete) {
    image.hidden = true;
    fallback.hidden = false;
  }

  startButton.addEventListener('click', () => {
    location.href = 'pages/acessibilidade.html';
  });
})();
