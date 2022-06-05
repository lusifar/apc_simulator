const express = require('express');

const { defaultStrategy, sharonStrategy } = require('../../utilities/strategyUtil');

const logger = require('../../../utilities/logger')('APC_SERVICE');

const router = express.Router();

//const client = require('prom-client');
//const gauge = new client.Gauge({ name: 'moisture', help: 'metric_help'});
const axios = require('axios');

router.post('/api/v1/process', async (req, res) => {
  const { id, type, thickness, moisture } = req.body;

  const handle = logger.begin({
    id,
    type,
    thickness,
    moisture,
  });

  //gauge.set(parseFloat(moisture));

  try {
    if (!global.cache) {
      throw new Error('the global cache is not existed');
    }
    const tFactor = global.cache.get('FACTOR_THICKNESS');
    const mFactor = global.cache.get('FACTOR_MOISTURE');

    let data = null;
    if (type === 'SHARON') {
      data = sharonStrategy(thickness, tFactor);
    } else {
      data = defaultStrategy(moisture, mFactor);
    }
    axios({
        method: 'get',
        url: `http://34.66.216.244/completed`,
        headers: {'thickness':thickness, 'tFactor':tFactor, 'moisture':moisture, 'mFactor':mFactor,'temperature':data['temperature'],'id':id,'type':type}
     }).then(res => {
  
      })
      .catch(error => {
        console.error(error);
      });
    logger.end(handle, { tFactor, mFactor, ...data }, `process (${id}) of APC has completed`);

    return res.status(200).send({ ok: true, data: { ...data, tFactor, mFactor } });
  } catch (err) {
    logger.fail(handle, { tFactor, mFactor }, err.message);

    return res.status(500).send({ ok: false, message: err.message });
  }
});

module.exports = router;
