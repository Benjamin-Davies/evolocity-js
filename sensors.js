const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const MultiSensor = require('./multi-sensor');
const GpsSensor = require('./gps-sensor');

const battery = new MultiSensor('BAT');
const motor = new MultiSensor('VOL', 'CUR');
const gps = new GpsSensor();

const sensors = [ battery, motor, gps ];
module.exports = { battery, motor, gps };

const parser = new Readline();
parser.on('data', line => {
  try {
    const data = parseNmea(line);
    for (const sensor in sensors) {
      sensor.process(data);
    }
  } catch (err) {
    console.error(err);
  }
});

SerialPort.list().then(ports => {
  for (const port of ports) {
    try {
      const stream = new SerialPort(port.comName, { baudRate: 256000 });
      stream.pipe(parser);
      stream.on('error', console.error);
    } catch (err) {
      console.error(err);
    }
  }
}).catch(console.error);

/**
 * @param{string} line
**/
function parseNmea(line) {
  if (line[0] !== '$')
    throw 'Line does not start with $';

  const asteriskIndex = line.indexOf('*');
  if (asteriskIndex < 0)
    throw 'No checksum';

  const body = line.slice(1, asteriskIndex);
  const checksum = parseInt(line.slice(asteriskIndex + 1), 16);
  const expected = calculateChecksum(body);
  if (expected !== checksum)
    throw `Invalid checksum. Got ${checksum} expected ${expected}`;

  const fields = body.split(',');

  return {
    talker: fields[0].slice(0, 2),
    messageType: fields[0].slice(2, 5),
    fields: fields.slice(1),
  };
}

/**
 * @param{string} body
**/
function calculateChecksum(body) {
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    sum ^= body.charCodeAt(i);
  }
  return sum;
}
