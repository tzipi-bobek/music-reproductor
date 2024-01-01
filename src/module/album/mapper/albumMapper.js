const { fromModelToEntity: songModelToEntityMapper } = require('../../song/mapper/songMapper');
const Album = require('../entity/Album');

exports.fromModelToEntity = ({
  id,
  title,
  artist,
  songsNumber,
  cover,
  year,
  createdAt = null,
  updatedAt = null,
  Songs = [],
}) =>
  new Album(
    Number(id),
    title,
    artist,
    Number(songsNumber),
    cover,
    Number(year),
    createdAt,
    updatedAt,
    Songs.map(songModelToEntityMapper),
  );
