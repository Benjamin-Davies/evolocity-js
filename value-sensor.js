class ValueSensor {
  constructor(type) {
    this.type = type;
    this.value = 0;
  }

  process(data) {
    if (data.talker === 'AR' &&
        data.messageType === this.type) {
      this.value = parseInt(data.fields[0]);
    }
  }
}

module.exports = ValueSensor;
