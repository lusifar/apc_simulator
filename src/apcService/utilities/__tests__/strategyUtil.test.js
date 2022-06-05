const {Strategy, sharonStrategy, defaultStrategy, stripStrategy } = require('../strategyUtil');

describe('Module strategyUtil', () => {
  const steakParameter = new Map(
    [["tFactor" , 0.5],
     ["mFactor" , 0.5],
     ["doneness" , 5],
     ["moisture" , 0.65],
     ["thickness" , 2.0]]
  ) 
  const strategy = new Strategy();

  it('Method sharonStrategy', () => {
    const sharonmethod = new sharonStrategy();
    strategy.setStrategy(sharonmethod);
    const res = strategy.runningStrategy(steakParameter);

    expect(res).toStrictEqual({
      period: 20,
      temperature: (steakParameter.get("thickness") * steakParameter.get("tFactor")).toFixed(2),
    });
  });

  it('Method defaultStrategy', () => {
    const defaultmethod = new defaultStrategy();
    strategy.setStrategy(defaultmethod);
    const res = strategy.runningStrategy(steakParameter);

    expect(res).toStrictEqual({
      period: (steakParameter.get("moisture") * steakParameter.get("mFactor")).toFixed(2),
      temperature: 100,
    });
  });

  it('Method stripStrategy', () => {
    const stripmethod = new stripStrategy();
    strategy.setStrategy(stripmethod);
    const res = strategy.runningStrategy(steakParameter);

    expect(res).toStrictEqual({
      period: (60 + steakParameter.get("doneness") * 30).toFixed(2),
      temperature: (steakParameter.get("thickness") * steakParameter.get("tFactor") + 100).toFixed(2),
    });
  });
});
