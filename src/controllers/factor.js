const Factor = require('../models/factor');

const logger = require('../utilities/logger')('INDEX');

const create = async (thickness, moisture) => {
  try {
    if (!thickness || !moisture) {
      throw new Error('the required parameters are not existed');
    }
    const data = await Factor.create({
      thickness,
      moisture,
    });

    return { id: data._id, thickness: data.thickness, moisture: data.moisture };
  } catch (err) {
    logger.error(err.message, { thickness, moisture });

    throw err;
  }
};

const get = async (filter) => {
  
  const data = await Factor.findOne({});
  if(data)
    return { id: data._id, thickness: data.thickness, moisture: data.moisture };
  return null;
  
};

const update = async (filter, data) => {
  try {
    if (!filter || !data) {
      throw new Error('the required parameters are not existed');
    }
    const { modifiedCount } = await Factor.updateMany({}, data);

    if (modifiedCount >= 1) {
      return { ok: true };
    } else {
      return { ok: false };
    }
  } catch (err) {
    logger.error(err.message, { filter, data });

    throw err;
  }
};

const destroy = async (filter) => {
  try {
    if (!filter) {
      throw new Error('the required parameters are not existed');
    }
    const { deletedCount } = await Factor.deleteMany({});

    if (deletedCount >= 1) {
      return { ok: true };
    } else {
      return { ok: false };
    }
  } catch (err) {
    logger.error(err.message, { filter });

    throw err;
  }
};

module.exports = {
  create,
  get,
  update,
  destroy,
};
