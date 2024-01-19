document.getElementById('audio-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  document.getElementById('audio-player').src = url;
});
