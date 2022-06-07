const defaultStrategy = (moisture, mFactor) => {
  return {
    period: (moisture * mFactor).toFixed(2),
    temperature: 100,
  };
};

const sharonStrategy = (thickness, tFactor) => {
  return {
    period: 20,
    temperature: (thickness * tFactor).toFixed(2),
  };
};

module.exports = {
  defaultStrategy,
  sharonStrategy,
};
