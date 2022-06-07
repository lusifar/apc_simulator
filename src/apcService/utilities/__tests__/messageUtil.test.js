const { natsMessageHandler } = require('../messageUtil');
const cacheParams = require('../../../controllers/params');
const dbClient = require('../../../utilities/db');

describe('Module messageUtil', () => {
  const fakeType = 'FACTOR_THICKNESS';
  const fakeFactor = 0.6;

  beforeEach( async () => {
    jest.clearAllMocks();
    await dbClient.init();
  });

  afterEach( async () => {
    await dbClient.deinit();
  });
  //

  it('Check mongoDB connection', () => {
    const status = dbClient.isConnected();
    expect (status).toBe(1);
  });

  it('Method natsMessageHandler for success', async () => {
    // default
    const data = await cacheParams.create(0.5,0.5);
    
    await natsMessageHandler(
      JSON.stringify({
        type: fakeType,
        factor: fakeFactor,
      })
    );

    const params = await cacheParams.get({_id: data._doc._id});
    await cacheParams.destroy({_id: data._doc._id});

    if (fakeType == 'FACTOR_THICKNESS')
      expect(params.factor_thickness).toBe(fakeFactor);
    else if (fakeType == 'FACTOR_MOISTURE')
      expect(params.factor_moisture).toBe(fakeFactor);
  });


  // it('Method natsMessageHandler for success', async () => {
  //   global.cache = {
  //     set: jest.fn().mockReturnValueOnce(true),
  //   };

  //   natsMessageHandler(
  //     JSON.stringify({
  //       type: fakeType,
  //       factor: fakeFactor,
  //     })
  //   );

  //   expect(global.cache.set).toHaveBeenCalledWith(fakeType, fakeFactor);
  // });

  // it('Method natsMessageHandler for failed', async () => {
  //   global.cache = {
  //     set: jest.fn().mockReturnValueOnce(true),
  //   };

  //   natsMessageHandler(
  //     JSON.stringify({
  //       type: 'FAKE_TYPE',
  //       factor: fakeFactor,
  //     })
  //   );

  //   expect(global.cache.set).toBeCalledTimes(0);
  // });
});
