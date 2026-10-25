(function () {
  const alertBox = document.getElementById('phaseAlert');

  document.querySelectorAll('.phase-button').forEach(button => {
    button.addEventListener('click', () => {
      alertBox.hidden = false;
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();
