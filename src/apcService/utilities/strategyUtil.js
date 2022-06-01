const defaultStrategy = (moisture, mFactor) => {
  const period = (moisture * mFactor).toFixed(2);

  return {
    period,
    temperature: 100,
  };
};

const sharonStrategy = (thickness, tFactor) => {
  const temperature = (thickness * tFactor).toFixed(2);

  return {
    period: 20,
    temperature,
  };
};

const stripStrategy = (moisture, mFactor, thickness, tFactor, doneness) => {
  const temperature = (thickness * tFactor + 100).toFixed(2);
  const period = (60 + doneness * 30).toFixed(2);

  return {
    period,
    temperature,
  };
};


module.exports = {
  defaultStrategy,
  sharonStrategy,
  stripStrategy,
};
