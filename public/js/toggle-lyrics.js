const element = document.querySelector('.song-data');
const toggleButton = document.querySelector('#lyrics .toggle-button');

let lyrics = element.getAttribute('data-lyrics');
if (lyrics) {
  lyrics = lyrics.replace(/\n/g, '<br />');
}
const lyricsElement = document.querySelector('#lyrics .content');
lyricsElement.innerHTML = lyrics;

const height = lyricsElement.clientHeight;

if (height > 100) {
  lyricsElement.style.maxHeight = '100px';
  toggleButton.style.display = 'block';
} else {
  toggleButton.style.display = 'none';
}

document.querySelector('#lyrics .toggle-button').addEventListener('click', function () {
  if (lyricsElement.style.maxHeight === 'none') {
    lyricsElement.style.maxHeight = '100px';
    this.textContent = 'Mostrar más';
  } else {
    lyricsElement.style.maxHeight = 'none';
    this.textContent = 'Mostrar menos';
  }
});
