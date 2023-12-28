require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const fs = require('fs');

module.exports = {
  development: {
    storage: process.env.DB_PATH,
    dialect: 'sqlite',
  },
};
