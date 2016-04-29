// https://www.npmjs.com/package/apn

'use strict';

/** Connect modules */
const apn = require('apn');
const argv = require('yargs').argv;

/** config notifications */
const apnConfig = require('./apn');
const expiry = Math.floor(Date.now() / 1000) + 3600;
const apnConnection = new apn.Connection(apnConfig.options);
const myDevice = new apn.Device(apnConfig.device.token);
const note = Object.assign(new apn.Notification(), {device: myDevice, expiry: expiry}, apnConfig.note);

if (argv.alert) note.alert = argv.alert;

/** Send notification */
apnConnection.sendNotification(note, myDevice);

function exit(message) {
  console.log(message);
  process.exit();
}

/** Handle events */
apnConnection.on('connected', (openSockets) => console.log('connected'));
apnConnection.on('error', (error) => console.log('error'));
apnConnection.on('drain',  () => console.log('drain'));
apnConnection.on('timeout',  () => console.log('timeout'));
apnConnection.on('disconnected', (openSockets) => console.log('disconnected'));
apnConnection.on('socketError', console.error);
apnConnection.on('transmitted', (notification, device) => exit('transmitted'));
apnConnection.on('transmissionError', (errCode, notification, device) => exit('transmissionError'));