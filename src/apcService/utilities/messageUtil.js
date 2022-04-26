const logger = require('../../utilities/logger')('APC_SERVICE');

const natsMessageHandler = (message) => {
  if (!global.cache) {
    return;
  }

  const msgObj = JSON.parse(message);
  if (msgObj.type === 'FACTOR_THICKNESS') {
    global.cache.set('FACTOR_THICKNESS', msgObj.factor);

    logger.info(`set thickness factor as ${msgObj.factor}`, { module: 'messageUtil', method: 'natsMessageHandler' });
  } else if (msgObj.type === 'FACTOR_MOISTURE') {
    global.cache.set('FACTOR_MOISTURE', msgObj.factor);

    logger.info(`set moisture factor as ${msgObj.factor}`, { module: 'messageUtil', method: 'natsMessageHandler' });
  }
};

module.exports = {
  natsMessageHandler,
};
