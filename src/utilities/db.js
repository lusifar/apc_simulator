const config = require('config');
const mongoose = require('mongoose');

const logger = require('./logger')('INDEX');

const init = async () => {
  try {
    await mongoose.connect(config.mongodb.connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Successfully connect to MongoDB');
  } catch (err) {
    logger.error(err.message);
  }
};

const deinit = async () => {
  try {
    await mongoose.disconnect();

    logger.info('Successfully disconnect to MongoDB');
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = {
  init,
  deinit,
};
