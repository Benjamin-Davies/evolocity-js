const request = require('request');
const { battery, motor, gps } = require('./sensors');

function sendTelemetry() {
  const data = gatherData();
  sendData(data);
}

function gatherData() {
  return {
    time: new Date(),
    current: motor.current,
    voltage: motor.voltage,
    speed: 0,
    battery_voltage: battery.voltage,
    location: gps.loc && gps.loc.toString(),
  };
}

function sendData(data) {
  request({
    url: 'https://php.mmc.school.nz/201BH/benjamindavies/evolocity/telemetry',
    method: 'POST',
    json: data,
    rejectUnauthorized: false,
  });
}

module.exports = sendTelemetry;
