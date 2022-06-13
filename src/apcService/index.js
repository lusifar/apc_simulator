const { domainService, nats } = require('config')
const express = require('express')
const { json, urlencoded } = require('body-parser')
const cors = require('cors')
const processRouter = require('./routers/v1/process')
const { natsMessageHandler } = require('./utilities/messageUtil')

class Controller {
  constructor(natsClient) {
    this.natsClient = natsClient
    this.app = express()
    this.app.use(json())
    this.app.use(urlencoded({ extended: true }))
    this.app.use(cors())
    this.app.use('', processRouter)
  }
  async run() {
    // subscribe the subject
    if (this.natsClient) {
      this.natsClient.subscribe(nats.stream, `${nats.subject}.params`, `${nats.consumer}_params`, natsMessageHandler)
    }
    return this.handle = new Promise((resolve, reject) => {
      this.app.listen(domainService.apc.port, () => resolve())
    })
  }
  terminate() {
    clearInterval(this.handle)
  }
}

const start = async (natsClient) => {
  const control = new Controller(natsClient)
  await control.run()
  return new Promise((resolve, reject) => resolve(control))
}

module.exports = {
  start,
}
