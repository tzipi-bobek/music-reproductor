/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.open-btn').forEach((button) => {
    button.addEventListener('click', function () {
      // Cierra todos los drawers y limpia su contenido
      document.querySelectorAll('.drawer').forEach((drawer) => {
        drawer.style.width = '0';
        const lyricsElement = drawer.querySelector('#lyrics');
        lyricsElement.innerHTML = '';
      });

      // Abre el drawer seleccionado y actualiza su contenido
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

      // Crea un elemento temporal para calcular el ancho del texto
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.whiteSpace = 'nowrap';
      tempElement.innerHTML = lyrics;
      document.body.appendChild(tempElement);

      // Calcula el ancho del texto y aplica el ancho al drawer
      const textWidth = Math.max(tempElement.getBoundingClientRect().width, 300); // Asegura un ancho mínimo de 200px
      drawer.style.width = `${textWidth}px`;

      // Elimina el elemento temporal
      document.body.removeChild(tempElement);
    });
  });
});
