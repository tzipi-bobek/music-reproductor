const Song = require('../entity/Song');

exports.fromModelToEntity = (
  {
    id,
    title,
    albumTitle,
    artist,
    albumArtist,
    compositor,
    genre,
    lyrics,
    lyricist,
    trackNumber,
    year,
    comment,
    audioFile,
    cover,
    albumID,
    createdAt = null,
    updatedAt = null,
    deletedAt = null,
    Album,
  },
  fromAlbumModelToEntityMapper,
) =>
  new Song(
    Number(id),
    title,
    albumTitle,
    artist,
    albumArtist,
    compositor,
    genre,
    lyrics,
    lyricist,
    Number(trackNumber),
    Number(year),
    comment,
    audioFile,
    cover,
    Number(albumID),
    createdAt,
    updatedAt,
    deletedAt,
    Album ? fromAlbumModelToEntityMapper(Album) : {},
  );

exports.fromFormToEntity = ({
  id,
  title,
  albumTitle,
  artist,
  'album-artist': albumArtist,
  compositor,
  genre,
  lyrics,
  lyricist,
  'track-number': trackNumber,
  year,
  comment,
  'audio-file': audioFile,
  cover,
  'album-id': albumID,
  'created-at': createdAt,
}) =>
  new Song(
    id,
    title,
    albumTitle,
    artist,
    albumArtist,
    compositor,
    genre,
    lyrics,
    lyricist,
    trackNumber,
    year,
    comment,
    audioFile,
    cover,
    albumID,
    createdAt,
  );
