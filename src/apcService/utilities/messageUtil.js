const logger = require('../../utilities/logger')('APC_SERVICE');
const axios = require('axios');
const natsMessageHandler = (message) => {
  if (!global.cache) {
    return;
  }

  const msgObj = JSON.parse(message);
  if (msgObj.type === 'FACTOR_THICKNESS') {
    global.cache.set('FACTOR_THICKNESS', msgObj.factor);
    axios({
        method: 'get',
        url: `http://34.72.100.211/thickness`,
        headers: {'factor':msgObj.factor}
    }).then(res => {
          //console.log(`statusCode: ${res.status}`);
          //console.log(res);
        })
        .catch(error => {
          console.error(error);
        });
    logger.info(`receive thickness factor: ${msgObj.factor}`);
  } else if (msgObj.type === 'FACTOR_MOISTURE') {
    global.cache.set('FACTOR_MOISTURE', msgObj.factor);
    axios({
        method: 'get',
        url: `http://34.72.100.211/moisture`,
        headers: {'factor':msgObj.factor}
    }).then(res => {
        // console.log(`statusCode: ${res.status}`);
        // console.log(res);
      })
      .catch(error => {
        console.error(error);
      });
    logger.info(`receive moisture factor: ${msgObj.factor}`);
  }
};

module.exports = {
  natsMessageHandler,
};
