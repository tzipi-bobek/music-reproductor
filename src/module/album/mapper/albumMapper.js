const { fromModelToEntity: songModelToEntityMapper } = require('../../song/mapper/songMapper');
const Album = require('../entity/Album');

exports.fromModelToEntity = ({
  id,
  title,
  songsNumber,
  cover,
  createdAt = null,
  updatedAt = null,
  artistFk,
  Songs = [],
}) =>
  new Album(
    Number(id),
    title,
    Number(songsNumber),
    cover,
    createdAt,
    updatedAt,
    artistFk,
    Songs.map(songModelToEntityMapper),
  );

exports.fromFormToEntity = ({
  id,
  title,
  'songs-number': songsNumber,
  cover,
  'created-at': createdAt,
  'artist-fk': artistFk,
}) => new Album(id, title, songsNumber, cover, createdAt, artistFk);
