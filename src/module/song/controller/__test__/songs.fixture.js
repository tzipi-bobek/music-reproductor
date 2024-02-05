const Song = require('../../entity/Song');

module.exports = function createTestSong(id, album = null) {
  return new Song(
    id,
    'Daylight',
    'Lover',
    'Taylor Swift',
    'Taylor Swift',
    'Taylor Swift',
    'Pop',
    '',
    'Taylor Swift',
    '3',
    '2019',
    '',
    '/uploads/song-audio-1704849107017.mp3',
    '/img/no-cover-available.jpg',
    1,
    undefined,
    undefined,
    undefined,
    album,
  );
};
