
const config = require('config');
require('dotenv').config()
const mongoose = require('mongoose');

const logger = require('./logger')('MongoDB');

const init = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Successfully connect to MongoDB', { module: 'db', method: 'init' });
  } catch (err) {
    logger.error(err.message, { module: 'db', method: 'init' });
  }
};

const deinit = async () => {
  try {
    await mongoose.disconnect();

    logger.info('Successfully disconnect to MongoDB', { module: 'db', method: 'deinit' });
  } catch (err) {
    logger.error(err.message, { module: 'db', method: 'deinit' });
  }
};

const isConnected = () => mongoose.connection.readyState;

module.exports = {
  init,
  deinit,
  isConnected
};
