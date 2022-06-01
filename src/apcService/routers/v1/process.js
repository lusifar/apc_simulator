const express = require('express');

const { defaultStrategy, sharonStrategy, stripStrategy } = require('../../utilities/strategyUtil');

const { get } = require('../../../controllers/factor');

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
    const tFactor = factor.thickness;
    const mFactor = factor.moisture;

    let data = null;
    if (type === 'SHARON') {
      data = sharonStrategy(thickness, tFactor);
    } else if (type == 'STRIP'){
      data = stripStrategy(moisture, mFactor,thickness, tFactor, doneness );
    } else {
      data = defaultStrategy(moisture, mFactor);
    }

    logger.end(handle, { tFactor, mFactor, ...data }, `process (${id}) of APC has completed`);

    return res.status(200).send({ ok: true, data: { ...data, tFactor, mFactor } });
  } catch (err) {
    logger.fail(handle, { tFactor, mFactor }, err.message);

    return res.status(500).send({ ok: false, message: err.message });
  }
});

module.exports = router;
