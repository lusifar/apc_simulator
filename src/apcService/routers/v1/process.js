const express = require('express');

const {Strategy, defaultStrategy, sharonStrategy, stripStrategy } = require('../../utilities/strategyUtil');

const { get } = require('../../../controllers/factor');
const { Logform } = require('winston');

const logger = require('../../../utilities/logger')('APC_SERVICE');

const router = express.Router();

router.post('/api/v1/process', async (req, res) => {
  const { id, type, thickness, moisture, doneness } = req.body;

  const handle = logger.begin({
    id,
    type,
    thickness,
    moisture,
    doneness,
  });

  try {
    if (!global.cache) {
      throw new Error('the global cache is not existed');
    }
    // const tFactor = global.cache.get('FACTOR_THICKNESS');
    // const mFactor = global.cache.get('FACTOR_MOISTURE');

    
    const factor = await get(); 
  
    var steakParameter = new Map(
      [["tFactor" , factor.thickness],
       ["mFactor" , factor.moisture],
       ["doneness" , doneness],
       ["moisture" , moisture],
       ["thickness" , thickness]]
    ) 

    let data = null;
    var strategy = new Strategy();
    if (type === 'SHARON') {
      var sharonmethod = new sharonStrategy();
      strategy.setStrategy(sharonmethod);
    } else if (type == 'STRIP'){
      var stripmethod = new stripStrategy();
      strategy.setStrategy(stripmethod);
    } else {
      var defaultmethod = new defaultStrategy();
      strategy.setStrategy(defaultmethod);
    }
    data = strategy.runningStrategy(steakParameter);

    const tFactor = steakParameter.get("tFactor");
    const mFactor = steakParameter.get("mFactor");
    logger.end(handle, { tFactor, mFactor, ...data }, `process (${id}) of APC has completed`);
    
    return res.status(200).send({ ok: true, data: { ...data, tFactor, mFactor } });
  } catch (err) {
    logger.fail(handle, { tFactor, mFactor }, err.message);

    return res.status(500).send({ ok: false, message: err.message });
  }
});

module.exports = router;
