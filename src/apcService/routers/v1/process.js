const express = require('express');

const { getData } = require('../../utilities/dataUtil');

const cacheParams =  require('../../../controllers/params');

const logger = require('../../../utilities/logger')('APC_SERVICE');

const router = express.Router();

router.post('/process', async (req, res) => {
  const { id, type, thickness, moisture } = req.body;

  const handle = logger.begin({
    id,
    type,
    thickness,
    moisture,
  });

  let tFactor = null;
  let mFactor = null;

  try {
    const params = await cacheParams.get({});
    tFactor = params.factor_thickness;
    mFactor = params.factor_moisture;

    let data = getData({
      type,
      thickness,
      moisture,
      tFactor,
      mFactor,
    });

    logger.end(handle, { version: 'v1', tFactor, mFactor, ...data }, `process (${id}) of APC has completed`);

    return res.status(200).send({ ok: true, data: { ...data, tFactor, mFactor, version: 'v1' } });
  } catch (err) {
    logger.fail(handle, { version: 'v1', tFactor, mFactor }, err.message);

    return res.status(500).send({ ok: false, message: err.message });
  }
});

module.exports = router;
