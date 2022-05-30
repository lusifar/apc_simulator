const logger = require('../../utilities/logger')('APC_SERVICE');
const cacheParams = require('../../controllers/params');

const natsMessageHandler = async (message) => {
  // if (!global.cache) {
  //   return;
  // }

  try {
    const data = await cacheParams.get({});
  } catch (err) {
    return;
  }


  const msgObj = JSON.parse(message);
  if (msgObj.type === 'FACTOR_THICKNESS') {
    // global.cache.set('FACTOR_THICKNESS', msgObj.factor);
    const result = await cacheParams.update({}, {factor_thickness: msgObj.factor});
    if (result.ok) 
      logger.info(`receive thickness factor: ${msgObj.factor}`);
    else 
      logger.err(`not receive thickness factor: ${msgObj.factor}`);

  } else if (msgObj.type === 'FACTOR_MOISTURE') {
    // global.cache.set('FACTOR_MOISTURE', msgObj.factor);
    const result = await cacheParams.update({}, {factor_moisture: msgObj.factor});
    if (result.ok) 
      logger.info(`receive moisture factor: ${msgObj.factor}`);
    else 
      logger.err(`not receive moisture factor: ${msgObj.factor}`);

  }
};

module.exports = {
  natsMessageHandler,
};
