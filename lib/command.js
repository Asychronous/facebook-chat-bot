'use strict';
var request = require('request');
var state = require('./state.js');
var invite = require('./invite.js');

function doChat(event, callback) {
  // receive #chat
  var id = event.senderID;
  getCurrentState(id, (err, result) => {
    if (err) throw (err);

    if (result === 'initial') {
      // check quota, if quota > 0, then user can chat
      getCurrentQuota(id, (err, result) => {
        if (err) throw (err);

        console.log(result.quota);
        if (result.quota > 0) {
          // if user is in the 'initial' state and quota has NOT run out
          // set state to 'waiting'
          // and then waiting for response from DB server


        }
      });

    }
  });

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
      invite.sendInvite(id, (err, res) => {
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
