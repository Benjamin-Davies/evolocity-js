const { appendFile, unlinkSync } = require('fs');
const net = require('net');
const firebase = require('firebase/app');
require('firebase/database');

const { battery, motor, gps } = require('./sensors');

var firebaseConfig = {
    apiKey: "AIzaSyBSeAWcNcpOhjivaOnpoCEyhFoIPxTw-L4",
    authDomain: "tau-morrow.firebaseapp.com",
    databaseURL: "https://tau-morrow.firebaseio.com",
    projectId: "tau-morrow",
    storageBucket: "",
    messagingSenderId: "429800378148",
    appId: "1:429800378148:web:26445bf438e92f6cdf2db1"
  };
firebase.initializeApp(firebaseConfig);

/**@type{net.Socket[]} */
const clients = [];
const ipcServer = net.createServer(c => {
  const index = clients.length;
  clients.push(c);

  c.on('close', () => {
    clients.splice(index, 1);
  })
});
// Attempt to clean up previous sockets
try {
  unlinkSync('/tmp/tau-morrow');
} catch {}
ipcServer.listen('/tmp/tau-morrow');

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
  const line = JSON.stringify(data) + '\n';

  appendFile('sensors.log', line, err => {
    if (err) console.error(err);
  });

  for (const c of clients) {
    c.write(line);
  }
}

module.exports = sendTelemetry;
