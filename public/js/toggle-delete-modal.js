const $modal = document.querySelector('#delete-modal');
const $html = document.querySelector('html');
const $deleteButtons = document.querySelectorAll('.delete-button');
const $cancelDeleteButtons = $modal.querySelectorAll('.cancel-delete-button');

const handleOpenModal = new Event('openModal', { bubbles: true });
const handleCloseModal = new Event('closeModal', { bubbles: true });

/**
 * @param {Event} evt
 */
function fillModal(evt) {
  const $modalContent = $modal.querySelector('.modal-content');
  const $modalForm = $modal.querySelector('.modal-form');
  const song = evt.target.closest('.song-data');
  const { id, title, artist } = song.dataset;

  $modalContent.textContent = `Está seguro de eliminar la cancion ${title} by ${artist} con ID ${id}?`;
  $modalForm.action = `/song/delete/${id}`;
}

/**
 * @param {Event} event.target
 */
function clickAway({ target }) {
  if (target.classList.contains('modal-background')) target.dispatchEvent(handleCloseModal);
}

/**
 * @param {Event} event
 */
function escKey(event) {
  if (event.key === 'Escape') event.target.dispatchEvent(handleCloseModal);
}

/**
 * @param {Event} evt
 */
function openModal(evt) {
  evt.stopPropagation();
  fillModal(evt);
  $html.classList.add('is-clipped');
  $modal.classList.add('is-active');
  $html.addEventListener('click', clickAway);
  $html.addEventListener('keydown', escKey);
}

function closeModal() {
  $html.classList.remove('is-clipped');
  $modal.classList.remove('is-active');
  $html.removeEventListener('click', clickAway);
}

document.addEventListener('openModal', openModal);
document.addEventListener('closeModal', closeModal);

$deleteButtons.forEach((btn) =>
  btn.addEventListener('click', ({ target }) => target.dispatchEvent(handleOpenModal)),
);
$cancelDeleteButtons.forEach((btn) =>
  btn.addEventListener('click', ({ target }) => target.dispatchEvent(handleCloseModal)),
);
