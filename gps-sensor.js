const { firestore: { GeoPoint } } = require('firebase');

class GpsSensor {
  constructor() {
    this.loc = null;
  }

  process(data) {
    if (data.talker === 'GN') {
      if (data.messageType === 'GLL') {
        this.loc = pointFromNmea(data.fields);
      }
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
