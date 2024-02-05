const configureDI = require('../di');

describe('DI is loading the right dependencies', () => {
  const container = configureDI();
  const { definitions } = container;

  test('DI is loading the right top level dependencies', () => {
    expect(definitions).toHaveProperty('Sequelize');
    expect(definitions).toHaveProperty('Multer');
    expect(definitions).toHaveProperty('AlbumController');
    expect(definitions).toHaveProperty('AlbumService');
    expect(definitions).toHaveProperty('AlbumRepository');
    expect(definitions).toHaveProperty('AlbumModel');
    expect(definitions).toHaveProperty('SongController');
    expect(definitions).toHaveProperty('SongService');
    expect(definitions).toHaveProperty('SongRepository');
    expect(definitions).toHaveProperty('SongModel');
  });

  test('AlbumController is constructed with the right dependencies', () => {
    const { AlbumController } = definitions;
    const expected = [expect.objectContaining({ existingDefinitionName: 'AlbumService' })];
    expect(AlbumController.deps).toEqual(expect.arrayContaining(expected));
  });

  test('AlbumService is constructed with the right dependencies', () => {
    const { AlbumService } = definitions;
    const expected = [expect.objectContaining({ existingDefinitionName: 'AlbumRepository' })];
    expect(AlbumService.deps).toEqual(expect.arrayContaining(expected));
  });

  test('AlbumRepository is constructed with the right dependencies', () => {
    const { AlbumRepository } = definitions;
    const expected = [expect.objectContaining({ existingDefinitionName: 'AlbumModel' })];
    expect(AlbumRepository.deps).toEqual(expect.arrayContaining(expected));
  });

  test('SongController is constructed with the right dependencies', () => {
    const { SongController } = definitions;
    const expected = [
      expect.objectContaining({ existingDefinitionName: 'SongService' }),
      expect.objectContaining({ existingDefinitionName: 'AlbumService' }),
      expect.objectContaining({ existingDefinitionName: 'Multer' }),
    ];
    expect(SongController.deps).toEqual(expect.arrayContaining(expected));
  });

  test('SongService is constructed with the right dependencies', () => {
    const { SongService } = definitions;
    const expected = [expect.objectContaining({ existingDefinitionName: 'SongRepository' })];
    expect(SongService.deps).toEqual(expect.arrayContaining(expected));
  });

  test('SongRepository is constructed with the right dependencies', () => {
    const { SongRepository } = definitions;
    const expected = [expect.objectContaining({ existingDefinitionName: 'SongModel' })];
    expect(SongRepository.deps).toEqual(expect.arrayContaining(expected));
  });
});
