const $lyricsModal = document.querySelector('#lyrics-modal');
const $lyricsHtml = document.querySelector('html');
const $lyricButtons = document.querySelectorAll('.lyrics-button');
const $cancelLyricsButtons = $lyricsModal.querySelectorAll('.delete');
const $dragElement = $lyricsModal.querySelector('.message-header');

const lyricsHandleOpenModal = new Event('openLyricsModal', { bubbles: true });
const lyricsHandleCloseModal = new Event('closeLyricsModal', { bubbles: true });

function giveSize(lyrics) {
  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'hidden';
  tempElement.style.whiteSpace = 'nowrap';
  tempElement.innerHTML = lyrics;
  document.body.appendChild(tempElement);

  const textWidth = Math.max(tempElement.getBoundingClientRect().width, 300);
  const textHeight = Math.max(tempElement.getBoundingClientRect().height, 300);
  $lyricsModal.style.width = `${textWidth}px`;
  $lyricsModal.style.height = `${textHeight}px`;
  $lyricsModal.style.maxHeight = '90vh';
  $lyricsModal.style.overflowY = 'auto';
  $lyricsModal.style.wordWrap = 'break-word';

  document.body.removeChild(tempElement);
}

/**
 * @param {Event} evt
 */
function fillLyricsModal(evt) {
  const $lyricsModalTitle = $lyricsModal.querySelector('.card-title');
  const $lyricsModalContent = $lyricsModal.querySelector('.content');

  const song = evt.target.closest('.song-data');
  const { title } = song.dataset;
  let { lyrics } = song.dataset;
  if (lyrics) {
    lyrics = lyrics.replace(/\n/g, '<br />');
  } else {
    lyrics = 'no hay letras disponibles';
  }

  $lyricsModalTitle.textContent = `Letras de "${title}":`;
  $lyricsModalContent.innerHTML = lyrics;

  giveSize(lyrics);
}

/**
 * @param {Event} event
 */
function lyricsEscKey(event) {
  if (event.key === 'Escape') event.target.dispatchEvent(lyricsHandleCloseModal);
}

/**
 * @param {Event} evt
 */
function openLyricsModal(evt) {
  evt.stopPropagation();
  fillLyricsModal(evt);
  $lyricsModal.classList.add('is-active');
  $lyricsHtml.addEventListener('keydown', lyricsEscKey);
}

function closeLyricsModal() {
  $lyricsModal.classList.remove('is-active');
}

$dragElement.onmousedown = (event) => {
  // Verificar si el evento se originó en el botón de eliminar
  if (Array.from($cancelLyricsButtons).includes(event.target)) {
    return; // Si es así, no hacer nada
  }

  event.preventDefault();

  const shiftX = event.clientX - $lyricsModal.getBoundingClientRect().left;
  const shiftY = event.clientY - $lyricsModal.getBoundingClientRect().top;

  $lyricsModal.style.position = 'absolute';
  $lyricsModal.style.zIndex = 1000;
  document.body.append($lyricsModal);

  function moveAt(pageX, pageY) {
    $lyricsModal.style.left = `${pageX - shiftX}px`;
    $lyricsModal.style.top = `${pageY - shiftY}px`;
  }

  moveAt(event.pageX, event.pageY);

  // eslint-disable-next-line no-shadow
  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

  $dragElement.onmouseup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    $lyricsModal.onmouseup = null;
  };
};

$dragElement.ondragstart = () => false;

document.addEventListener('openLyricsModal', openLyricsModal);
document.addEventListener('closeLyricsModal', closeLyricsModal);

$lyricButtons.forEach((btn) =>
  btn.addEventListener('click', ({ target }) => target.dispatchEvent(lyricsHandleOpenModal)),
);

$cancelLyricsButtons.forEach((btn) =>
  btn.addEventListener('click', ({ target }) => target.dispatchEvent(lyricsHandleCloseModal)),
);
