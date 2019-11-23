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
    return 5/220*1220* this.voltageSensor.value/1024;
  }
  get current() {

    const offset = 2490;
    const sensitivity = 67;
    const voltage = 5000*this.currentSensor.value/1024;
    const value = -(voltage - offset) / sensitivity;

    return value;
  }
}

module.exports = MultiSensor;
