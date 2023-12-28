const $modal = document.querySelector('.modal');
const $html = document.querySelector('html');

const handleCloseModal = new Event('closeModal', { bubbles: true });

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
