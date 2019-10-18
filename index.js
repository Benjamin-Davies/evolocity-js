const { battery, motor, gps } = require('./sensors');
const telemetry = require('./telemetry');

setInterval(telemetry, 500);

clearScreen();

setInterval(() => {
  resetPos();

  println(`Taumorrow`);
  println();
  println(`Battery: \x1b[34m${battery.voltage.toFixed(1)}V\x1b[39m`);
  bar(battery.voltage/30);
  println();
  println(`Motor: \x1b[32m${motor.current.toFixed(1)}A\x1b[39m`);
  bar(motor.current/30);
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

function bar(value) {
  value = Math.floor(value * 40);
  let s = '';
  for (let i = 0; i < value; i++)
    s += '#';
  println(s);
}

function println(line = '') {
  process.stdout.write(`\x1B[K${line}\n`);
}
