const natsMessageHandler = (message) => {
  if (!global.cache) {
    return;
  }

  const msgObj = JSON.parse(message);
  if (msgObj.type === 'FACTOR_THICKNESS') {
    global.cache.set('FACTOR_THICKNESS', msgObj.factor);
  } else if (msgObj.type === 'FACTOR_MOISTURE') {
    global.cache.set('FACTOR_MOISTURE', msgObj.factor);
  }
};

module.exports = {
  natsMessageHandler,
};
