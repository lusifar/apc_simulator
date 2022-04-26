const { nats } = require('config');

const NodeCache = require('node-cache');

const NATSClient = require('./utilities/natsClient');

const measureService = require('./measureService');
const apcService = require('./apcService');
const paramsService = require('./paramsService');

let loopHandle = null;

const initGlobalNATSClient = async () => {
  // instantiate the nats client
  global.natsClient = NATSClient.instance();

  await global.natsClient.connect(nats.name, [nats.connection]);

  // clear stream and consumer by existence
  let stream = await global.natsClient.getStream(nats.stream);
  if (stream) {
    let consumer = await global.natsClient.getConsumer(nats.stream, `${nats.consumer}_params`);
    if (consumer) {
      await global.natsClient.deleteConsumer(nats.stream, `${nats.consumer}_params`);
    }
    await global.natsClient.deleteStream(nats.stream);
  }

  // add the stream
  await global.natsClient.addStream(nats.stream, [`${nats.subject}.>`]);

  // add the consumer
  await global.natsClient.addConsumer(nats.stream, `${nats.subject}.params`, `${nats.consumer}_params`);
};

const initGlobalCache = async () => {
  global.cache = new NodeCache();

  global.cache.set('FACTOR_THICKNESS', 0.5);
  global.cache.set('FACTOR_MOISTURE', 0.5);
};

const run = async () => {
  // initialize the global resource
  await initGlobalNATSClient();
  await initGlobalCache();

  // run all services
  await apcService.run();
  await paramsService.run();
  loopHandle = await measureService.run();
};

run();

process.on('SIGINT', async () => {
  if (global.cache) {
    await global.cache.close();
    global.cache = null;
  }

  if (global.natsClient) {
    await global.natsClient.disconnect();
    global.natsClient = null;
  }

  if (loopHandle) {
    clearInterval(loopHandle);
  }

  process.exit();
});
