'use strict';
var request = require('request');

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

function doLeave() {

}

function doNext() {

}

function doInvited() {

}

module.exports.doChat = doChat;
module.exports.doLeave = doLeave;
module.exports.doNext = doNext;
module.exports.doInvited = doInvited;
