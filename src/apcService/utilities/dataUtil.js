const { defaultStrategy, sharonStrategy } = require('./strategyUtil');

const getData = ({ type, thickness, moisture, tFactor, mFactor }) => {
  let data = null;

  if (
    (typeof thickness == 'number' && typeof tFactor == 'number') ||
    (typeof moisture == 'number' && typeof mFactor == 'number')
  ) {
    switch (type) {
      case 'SHARON':
        data = sharonStrategy(thickness, tFactor);
        break;
      case 'FILET':
        data = defaultStrategy(moisture, mFactor);
        break;
      case 'STRIP':
        data = defaultStrategy(moisture, mFactor);
        break;
      default:
        data = defaultStrategy(moisture, mFactor);
    }
  }
  return data;
};

module.exports = {
  getData,
};
