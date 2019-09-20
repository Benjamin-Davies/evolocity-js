const ValueSensor = require('./value-sensor');

class MultiSensor {
  constructor(voltageType, currentType) {
    this.voltageSensor = new ValueSensor(voltageType);
    this.currentSensor = new ValueSensor(currentType);
  }

  process(data) {
    this.voltageSensor.process(data);
    this.currentSensor.process(data);
  }

  get voltage() {
    return this.voltageSensor.value;
  }
  get current() {
    return this.currentSensor.value;
  }
}

module.exports = MultiSensor;
