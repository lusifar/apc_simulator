const logger = require('../../utilities/logger')('APC_SERVICE');

// Prometheus
const prom_client_path = '../../../prom-client'
const client = require(prom_client_path);
const gauge = new client.Gauge({
  name: 'factor_gauge',
  help: 'metrics_help',
  labelNames: ['thickness', 'moisture']
});
gauge.set({thickness: '1'}, 1);
//

const natsMessageHandler = (message) => {
  if (!global.cache) {
    return;
  }

  const msgObj = JSON.parse(message);
  if (msgObj.type === 'FACTOR_THICKNESS') {
    gauge.set({thickness: '1'}, msgObj.factor*100);

    logger.info(`receive thickness factor: ${msgObj.factor}`);
  } else if (msgObj.type === 'FACTOR_MOISTURE') {
    gauge.set({moisture: '2'}, msgObj.factor*100);

    global.cache.set('FACTOR_MOISTURE', msgObj.factor);
    logger.info(`receive moisture factor: ${msgObj.factor}`);
  }
};

module.exports = {
  natsMessageHandler,
};
