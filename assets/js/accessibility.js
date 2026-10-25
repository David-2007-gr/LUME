(function () {
  const preview = document.getElementById('previewText');
  const fontButtons = Array.from(document.querySelectorAll('[data-font]'));

  function updateSelectedFont(size) {
    Lume.setFontSize(size);
    preview.style.fontSize = Lume.fontPixels(size) + 'px';

    fontButtons.forEach(button => {
      const selected = button.dataset.font === size;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  fontButtons.forEach(button => {
    button.addEventListener('click', () => updateSelectedFont(button.dataset.font));
  });

  updateSelectedFont(Lume.getFontSize());
})();
