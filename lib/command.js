'use strict';
var request = require('request');
var state = require('./state.js');

function doChat() {

}

function doLeave(event) {
  var senderID = event.senderID;
  console.log(senderID);
  state.getCurrentState(senderID, function(err, state) {
    if (err) throw (err);
    if (state === 'connected') {
      state.setCurrentState(senderID, 'initial', (err, success) => {
        if (err) throw (err);
        if (success) {
          console.log('Your state change');
        }
      });
    }
  });
}

function doNext() {

}

function doInvited(event) {

  var senderID = event.senderID;
  console.log(senderID);
  state.getCurrentState(senderID, function(err, state) {
    if (err) throw (err);
    if (state === 'connected') {
      state.sendInvite(id, (err, res) => {
        if (err) throw (err);
        if (res.acptA === true && res.acptB === true) {
          console.log('Congrat!!!!!!!!');
          if (senderID === res.uidA) {
            console.log(`friends: https://www.facebook.com/${res.uidB}`);
          }else {
            console.log(`friends: https://www.facebook.com/${res.uidA}`);
          }
        } else {
          console.log('Your invitation has been saved! >< ');
        }
      });
    }
  });
}

module.exports.doChat = doChat;
module.exports.doLeave = doLeave;
module.exports.doNext = doNext;
module.exports.doInvited = doInvited;
