require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

const configureDIC = require('./config/di');
const { initSongModule } = require('./module/song/module');
const { initAlbumModule } = require('./module/album/module');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

nunjucks.configure('src/module', {
  autoescape: true,
  express: app,
});

const container = configureDIC();

initSongModule(app, container);
initAlbumModule(app, container);

/**
 * @type {import('./module/default/controller/defaultController')} defaultController
 */
const defaultController = container.get('DefaultController');
defaultController.configureRoutes(app);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500);
  res.render(`default/views/error.njk`, {
    title: 'Error',
    error: err,
  });
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
