class GpsSensor {
  constructor() {
    this.loc = undefined;
  }

  process(data) {
    if (data.talker === 'GN') {
      if (data.messageType === 'GLL') {
        this.loc = Location.fromNmea(data.fields);
      }
    }
  }
}

class Location {
  constructor(latitude = new LocationAxis(), longitude = new LocationAxis()) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  toString() {
    return `${this.latitude} ${this.longitude}`;
  }

  /**
   * @param{string[]} fields
  **/
  static fromNmea(fields) {
    return new Location(
      LocationAxis.fromNmea(...fields.slice(0, 2)),
      LocationAxis.fromNmea(...fields.slice(2, 4)),
    );
  }
}

class LocationAxis {
  constructor(direction = 'N', degrees = 0, minutes = 0) {
    this.direction = direction;
    this.degrees = degrees;
    this.minutes = minutes;
  }

  toString() {
    return `${this.degrees} ${this.minutes.toFixed(5)}${this.direction}`;
  }

  /**
   * @param{string} v1
   * @param{string} v2
  **/
  static fromNmea(v1, v2) {
    const n = parseFloat(v1);
    return new LocationAxis(
      v2,
      Math.floor(n / 100),
      n % 100,
    );
  }
}

module.exports = GpsSensor;
