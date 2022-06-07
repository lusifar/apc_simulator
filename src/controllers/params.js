const Params = require('../models/params');

const logger = require('../utilities/logger')('MongoDB');

const create = async (factor_thickness, factor_moisture) => {
  try {
    if (!factor_thickness || !factor_moisture) {
      throw new Error('the required parameters are not existed');
    }

    const data = await Params.create({
      factor_thickness: factor_thickness,
      factor_moisture: factor_moisture,
    });

    return { ...data };
  } catch (err) {
    logger.error(err.message, { model: 'Params', method: 'create', factor_thickness: factor_thickness, 
        factor_moisture: factor_moisture });

    throw err;
  }
};

const get = async (filter) => {
  try {
    if (!filter) {
      throw new Error('the required parameters are not existed');
    }

    const data = await Params.findOne(filter);

    return { id: data._id, factor_thickness: data.factor_thickness, 
        factor_moisture: data.factor_moisture };
  } catch (err) {
    logger.error(err.message, { model: 'Params', method: 'get', filter });

    throw err;
  }
};

const update = async (filter, data) => {
  try {
    if (!filter || !data) {
      throw new Error('the required parameters are not existed');
    }

    const { modifiedCount } = await Params.updateMany(filter, data);

    if (modifiedCount >= 1) {
      return { ok: true };
    } else {
      return { ok: false };
    }
  } catch (err) {
    logger.error(err.message, { model: 'Params', method: 'update', filter, data });

    throw err;
  }
};

const destroy = async (filter) => {
  try {
    if (!filter) {
      throw new Error('the required parameters are not existed');
    }
    const { deletedCount } = await Params.deleteMany(filter);

    if (deletedCount >= 1) {
      return { ok: true };
    } else {
      return { ok: false };
    }
  } catch (err) {
    logger.error(err.message, { model: 'Params', method: 'destroy', filter });

    throw err;
  }
};

module.exports = {
  create,
  get,
  update,
  destroy,
};
