const { sharonStrategy, defaultStrategy, stripStrategy } = require('../strategyUtil');

describe('Module strategyUtil', () => {
  const fakeThickness = 2.0;
  const fakeMoisture = 0.65;
  const fakeTFactor = 0.5;
  const fakeMFactor = 0.5;
  const fakeDoneness = 5;

  it('Method sharonStrategy', () => {
    const res = sharonStrategy(fakeThickness, fakeTFactor);

    expect(res).toStrictEqual({
      period: 20,
      temperature: (fakeThickness * fakeTFactor).toFixed(2),
    });
  });

  it('Method defaultStrategy', () => {
    const res = defaultStrategy(fakeMoisture, fakeMFactor);

    expect(res).toStrictEqual({
      period: (fakeMoisture * fakeMFactor).toFixed(2),
      temperature: 100,
    });
  });

  it('Method stripStrategy', () => {
    const res = stripStrategy(fakeMoisture, fakeMFactor, fakeThickness, fakeTFactor, fakeDoneness);

    expect(res).toStrictEqual({
      period: (60 + fakeDoneness * 30).toFixed(2),
      temperature: (fakeThickness * fakeTFactor + 100).toFixed(2),
    });
  });
});
