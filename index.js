const { battery, motor, gps } = require('./sensors');
const telemetry = require('./telemetry');

setInterval(telemetry, 500);

clearScreen();

setInterval(() => {
  resetPos();

  println(`Taumorrow`);
  println();
  println(`Battery: ${battery.voltage}V`);
  println(`Motor: ${motor.voltage}V ${motor.current}A`);
  println();
  println(`Location: ${gps.loc}`);
  println();
}, 200);

function clearScreen() {
  process.stdout.write(`\x1B[2J`);
}

function resetPos() {
  process.stdout.write(`\x1B[0;0H`);
}

function println(line = '') {
  process.stdout.write(`\x1B[K${line}\n`);
}
