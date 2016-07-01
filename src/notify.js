'use strict';

const PushBullet = require('pushbullet');


function Notifier(apiToken) {
  this.pusher = new PushBullet(apiToken);
}


Notifier.prototype.notify = function(deviceId, noteName, noteText) {
  this.pusher.note(deviceId, noteName, noteText, function(err, res) {
    if (err === null) {
      console.log('Sent notification to ' + deviceId);
    }
  });
};


module.exports = exports = Notifier;
