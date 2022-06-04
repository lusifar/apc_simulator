const logger = require('../../utilities/logger')('APC_SERVICE');

// Prometheus
const client = require('../../../prom-client');
const counter = new client.Counter({
  name: 'metric_name',
  help: 'metric_help',
});
counter.inc(); // Increment by 1
counter.inc(10); // Increment by 10


const natsMessageHandler = (message) => {
  if (!global.cache) {
    return;
  }

  const msgObj = JSON.parse(message);
  if (msgObj.type === 'FACTOR_THICKNESS') {
    global.cache.set('FACTOR_THICKNESS', msgObj.factor);

    logger.info(`receive thickness factor: ${msgObj.factor}`);
  } else if (msgObj.type === 'FACTOR_MOISTURE') {
    global.cache.set('FACTOR_MOISTURE', msgObj.factor);

    logger.info(`receive moisture factor: ${msgObj.factor}`);
  }
};

module.exports = {
  natsMessageHandler,
};
