const ValueSensor = require('./value-sensor');

class MultiSensor {
  constructor(voltageType, currentType) {
    this.voltageSensor = new ValueSensor(voltageType);
    this.currentSensor = new ValueSensor(currentType);
    this.rollingAvg = [0, 0, 0, 0, 0];
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
    const sensitivity = 66;
    const voltage = 5000*this.currentSensor.value/1024;
    const value = -(voltage - offset) / sensitivity;

    this.rollingAvg[0] = value;
    const avg = this.rollingAvg.reduce((a,b)=>a+b)/5;
    for (let i = 0; i < 5-1; i++)
      this.rollingAvg[i+1] = this.rollingAvg[i];
    return avg;
  }
}

module.exports = MultiSensor;
