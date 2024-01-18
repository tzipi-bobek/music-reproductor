/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.open-btn').forEach((button) => {
    button.addEventListener('click', function () {
      document.querySelectorAll('.drawer').forEach((drawer) => {
        drawer.style.width = '0';
        const lyricsElement = drawer.querySelector('#lyrics');
        lyricsElement.innerHTML = '';
      });

      const drawerId = this.getAttribute('data-drawer-id');
      let lyrics = this.getAttribute('data-lyrics');
      if (lyrics) {
        lyrics = lyrics.replace(/\n/g, '<br />');
      } else {
        lyrics = 'no hay letras disponibles';
      }
      const drawer = document.querySelector(`#drawer-${drawerId}`);
      const lyricsElement = drawer.querySelector('#lyrics');
      lyricsElement.innerHTML = lyrics;

      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.whiteSpace = 'nowrap';
      tempElement.innerHTML = lyrics;
      document.body.appendChild(tempElement);

      const textWidth = Math.max(tempElement.getBoundingClientRect().width, 300);
      drawer.style.width = `${textWidth}px`;

      document.body.removeChild(tempElement);
    });
  });

  document.querySelectorAll('.close-btn').forEach((button) => {
    button.addEventListener('click', function (evento) {
      const drawer = this.parentNode;
      drawer.style.width = '0';
      event.stopPropagation();
    });
  });
});
