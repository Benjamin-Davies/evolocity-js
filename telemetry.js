const { appendFile, unlinkSync } = require('fs');
const net = require('net');
const { hostname } = require('os');

const firebase = require('firebase/app');
require('firebase/firestore');

const { battery, motor, gps } = require('./sensors');

const firebaseConfig = {
  apiKey: "AIzaSyBSeAWcNcpOhjivaOnpoCEyhFoIPxTw-L4",
  authDomain: "tau-morrow.firebaseapp.com",
  databaseURL: "https://tau-morrow.firebaseio.com",
  projectId: "tau-morrow",
  storageBucket: "tau-morrow.appspot.com",
  messagingSenderId: "429800378148",
  appId: "1:429800378148:web:6510d4de4e423db7df2db1",
  measurementId: "G-QR1415PS2B"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const sensors = db.collection('sensors');

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
} catch (_) {}
ipcServer.listen('/tmp/tau-morrow');

function sendTelemetry() {
  const data = gatherData();
  sendData(data);
}

function gatherData() {
  return {
    hostname: hostname(),
    time: new Date(),
    current: motor.current,
    voltage: motor.voltage,
    speed: 0,
    battery_voltage: battery.voltage,
    location: gps.loc && gps.loc.toString() || null,
  };
}

function sendData(data) {
  sensors.add(data);

  const line = JSON.stringify(data) + '\n';

  appendFile('sensors.log', line, err => {
    if (err) console.error(err);
  });

  for (const c of clients) {
    c.write(line);
  }
}

module.exports = sendTelemetry;
