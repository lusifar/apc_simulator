const { getData } = require('../dataUtil');

describe('Module messageUtil', () => {
  const fakeThickness = 2.0;
  const fakeTFactor = 0.5;
  const fakeMoisture = 0.65;
  const fakeMFactor = 0.5;
  it('Method getData for success with sharonStrategy', async () => {
    const fakeType = 'SHARON';
    const data = getData({
      type: fakeType,
      thickness: fakeThickness,
      tFactor: fakeTFactor,
    });

    expect(data).toStrictEqual({
      period: 20,
      temperature: (fakeThickness * fakeTFactor).toFixed(2),
    });
  });

  it('Method getData for success with defaultStrategy', async () => {
    const fakeType = 'RIB_EYE';
    const data = getData({
      type: fakeType,
      moisture: fakeMoisture,
      mFactor: fakeMFactor,
    });

    expect(data).toStrictEqual({
      period: (fakeMoisture * fakeMFactor).toFixed(2),
      temperature: 100,
    });
  });

  it('Method getData for success with mixStrategy', async () => {
    const fakeType = 'STRIP';
    const data = getData({
      type: fakeType,
      thickness: fakeThickness,
      tFactor: fakeTFactor,
      moisture: fakeMoisture,
      mFactor: fakeMFactor,
    });

    expect(data).toStrictEqual({
      period: (fakeMoisture * fakeMFactor).toFixed(2),
      temperature: (fakeThickness * fakeTFactor).toFixed(2),
    });
  });

  it('Method getData for failed with not enough parameters', async () => {
    const data = getData({
      type: 'DONT CARE',
      moisture: 0.3,
    });

    expect(data).toBeNull();
  });
});
