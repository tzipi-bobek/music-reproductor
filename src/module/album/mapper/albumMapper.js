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
    title ? songModelToEntityMapper(title) : title,
    artist ? songModelToEntityMapper(artist) : artist,
    Number(songsNumber),
    cover ? songModelToEntityMapper(cover) : cover,
    Number(year),
    createdAt,
    updatedAt,
    Songs.map(songModelToEntityMapper),
  );

exports.fromFormToEntity = ({
  id,
  title,
  artist,
  'songs-number': songsNumber,
  cover,
  year,
  'created-at': createdAt,
}) => new Album(id, title, artist, songsNumber, cover, year, createdAt);
