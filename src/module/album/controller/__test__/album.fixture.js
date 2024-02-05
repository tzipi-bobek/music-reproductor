const Album = require('../../entity/Album');

module.exports = function createTestAlbum(id, includeSongs = true) {
  return new Album(
    id,
    'Lover',
    'Taylor Swift',
    3,
    '/img/no-cover-available.jpg',
    '2023',
    undefined,
    undefined,
    undefined,
    includeSongs
      ? Array.from({ length: 3 }, (songId) => ({
          id: songId,
          albumId: '1',
        }))
      : undefined,
  );
};
