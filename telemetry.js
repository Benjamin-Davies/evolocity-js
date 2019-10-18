//const request = require('request');
const { battery, motor, gps } = require('./sensors');
const firebase = require('firebase/app');
require('firebase/database');

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
  require('fs').appendFile('sensors.log', JSON.stringify(data) + '\n', err => {
    console.error(err);
  });
}

//unused
  //request({
    //url: 'https://php.mmc.school.nz/201BH/benjamindavies/evolocity/telemetry',
    //method: 'POST',
    //json: data,
    //rejectUnauthorized: false,
  //}).on('data', data => {
	  //console.log(data.toString('utf-8'));
  //}).on('error', err => {
    //console.error(err);
  //});

module.exports = sendTelemetry;
