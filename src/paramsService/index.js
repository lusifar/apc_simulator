const { cron, domainService } = require('config');
const axios = require('axios');
const express = require('express');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const factorRouter = require('./routers/v1/factor');

class Controller {
  constructor(natsClient) {
    this.app = express();
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use('', factorRouter(natsClient));
  }
  async run() {
    return new Promise((resolve, reject) => {
      this.app.listen(domainService.params.port, () => {
        const handler = setInterval(async () => {
          const tFactor = Math.random().toFixed(2);
          const mFactor = Math.random().toFixed(2);

          await axios.post(`${domainService.params.endpoint}/api/v1/factor/thickness`, { factor: tFactor });
          await axios.post(`${domainService.params.endpoint}/api/v1/factor/moisture`, { factor: mFactor });
        }, cron.paramsPeriod);

        resolve(handler);
      });
    });
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
