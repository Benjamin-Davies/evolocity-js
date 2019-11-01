const { firestore: { GeoPoint } } = require('firebase');
const { Socket } = require('net');

const USE_NMEA = false;

const GPSD_PORT = 2947;
const GPSD_INIT = '?WATCH={"class":"WATCH","json":true}';

class GpsSensor {
  constructor() {
    this.loc = null;
    this.speed = 0;

    if (!USE_NMEA) {
      this.gpsdSocket = new Socket();
      this.gpsdSocket.setEncoding('ascii');
      this.gpsdSocket.on('data', str => {
        for (const line of str.split('\n')) {
          if (!line)
            continue;
          const obj = JSON.parse(line);
          this.processGpsd(obj);
        }
      });
      this.gpsdSocket.connect(GPSD_PORT, 'localhost');
    }
  }

  process(data) {
    if (USE_NMEA) {
      if (data.talker === 'GN') {
        if (data.messageType === 'GLL') {
          this.loc = pointFromNmea(data.fields);
        }
      }
    }
  }

  processGpsd(data) {
    switch (data.class) {
      case 'TPV':
        this.loc = new GeoPoint(data.lat, data.lon);
        this.speed = data.speed;
        break;
      case 'VERSION':
        this.gpsdSocket.write(GPSD_INIT);
        break;
    }
  }
}

/**
 * @param{string[]} fields
 **/
function pointFromNmea(fields) {
  return new GeoPoint(
    axisFromNmea(...fields.slice(0, 2)),
    axisFromNmea(...fields.slice(2, 4)),
  );
}

function axisFromNmea(v1, v2) {
  const n = parseFloat(v1);
  const sign = v2 === 'N' || v2 == 'E'
    ? 1 : -1;
  const deg = Math.floor(n / 100);
  const min = n % 100;
  return sign*(deg + min/60);
}

module.exports = GpsSensor;
