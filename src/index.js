const dotenv = require('dotenv')
dotenv.config()
const { nats } = require('config')
const NodeCache = require('node-cache')
const logger = require('./utilities/logger')('INDEX')
const NATSClient = require('./utilities/natsClient')
const measureService = require('./measureService')
const apcService = require('./apcService')
const paramsService = require('./paramsService')

const initGlobalCache = async () => {
  global.cache = new NodeCache()
  global.cache.set('FACTOR_THICKNESS', 0.5)
  global.cache.set('FACTOR_MOISTURE', 0.5)
}

const initNATSClient = async () => {
  // instantiate the nats client
  const natsClient = NATSClient.instance()
  const connection = process.env.NATS_SERVICE_CONNECTION || nats.connection
  logger.info(`nats-server connection: ${connection}`)
  await natsClient.connect(nats.name, [connection])
  // clear stream and consumer by existence
  let stream = await natsClient.getStream(nats.stream)
  if (stream) {
    let consumer = await natsClient.getConsumer(nats.stream, `${nats.consumer}_params`)
    if (consumer) {
      await natsClient.deleteConsumer(nats.stream, `${nats.consumer}_params`)
    }
    await natsClient.deleteStream(nats.stream)
  }
  // add the stream
  await natsClient.addStream(nats.stream, [`${nats.subject}.>`])
  // add the consumer
  await natsClient.addConsumer(nats.stream, `${nats.subject}.params`, `${nats.consumer}_params`)

  return new Promise((resolve, reject) => resolve(natsClient))
}

class Controller {
  async run() {
    // initialize the global resource
    await initGlobalCache()
    this.natsClient = await initNATSClient()

    // run all services
    this.apcControl = await apcService.start(this.natsClient)
    this.paramsControl = await paramsService.start(this.natsClient)
    this.measureHandle = await measureService.run()
  }
  async terminate() {
    if (global.cache) {
      await global.cache.close()
      global.cache = null
    }
    if (this.natsClient) { await this.natsClient.disconnect() }
    if (this.apcControl) { this.apcControl.terminate() }
    if (this.paramsControl) { this.paramsControl.terminate() }
    if (this.measureHandle) { clearInterval(this.measureHandle) }
    process.exit()
  }
}

const control = new Controller()
control.run()
process.on('SIGINT', control.terminate)
