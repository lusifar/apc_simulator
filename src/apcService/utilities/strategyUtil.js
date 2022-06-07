var Strategy = function(){
  this.method = "";
};

Strategy.prototype = {
  setStrategy: function(method) {
    this.method = method;
  },
  runningStrategy: function(steakParameter) {
    return this.method.runningStrategy(steakParameter);
  }
};

var defaultStrategy = function(){
  this.runningStrategy = function(steakParameter){
    const period = (steakParameter.get("moisture") * steakParameter.get("mFactor")).toFixed(2);

    return {
      period,
      "temperature":100,
    }
  }
};

var sharonStrategy = function(){
  this.runningStrategy = function(steakParameter){
    const temperature = (steakParameter.get("thickness") * steakParameter.get("tFactor")).toFixed(2);

    return {
      "period": 20,
      temperature,
    };
  }
};

var stripStrategy = function(){
  this.runningStrategy = function(steakParameter){
    const temperature = (steakParameter.get("thickness") * steakParameter.get("tFactor") + 100).toFixed(2);
    const period = (60 + steakParameter.get("doneness") * 30).toFixed(2);

    return {
      period,
      temperature,
    };
  }
};

module.exports = {
  Strategy,
  defaultStrategy,
  sharonStrategy,
  stripStrategy,
};
