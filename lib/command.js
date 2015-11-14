'use strict';
var request = require('request');
var state = require('./state.js');
var invite = require('./invite.js');
var quota = require('./quota.js');

function doChat(event, api) {
  // receive #chat
  var id = event.senderID;
  var threadID = event.threadID;
  state.getCurrentState(id, (err, result) => {
    console.log(err);
    console.log(result);
    if (err) throw (err);

    if (result === 'initial') {
      // check quota, if quota > 0, then user can chat
      quota.getCurrentQuota(id, (err, result) => {
        if (err) throw (err);

        console.log(result.quota);
        if (result.quota > 0) {
          // if user is in the 'initial' state and quota has NOT run out
          // set state to 'waiting'
          // and then waiting for response from DB server
          state.setWaitingState(id, (err, success) => {
            if (err) throw (err);
            if (success) {
              // get pair
              api.sendMessage('Start to chat!', threadID);
              callback(null, true);
            } else {
              // not get pair
              api.sendMessage('Nobody here. :(', threadID);
              callback(null, true);
            }
          });
        } else {
          api.sendMessage('Your quota has run out!', threadID);
        }
      });

    }
  });

}

function doLeave(event, api) {
  var senderID = event.senderID;
  var threadID = event.threadID;
  state.getCurrentState(senderID, function(err, state) {
    if (err) throw (err);
    if (state === 'connected') {
      state.setInitialState(senderID, (err, success) => {
        if (err) throw (err);
        if (success) {
          api.sendMessage('You have left the chat', threadID);
        }else {
          api.sendMessage('Left Failed!', threadID);
        }
      });
    }
  });
}

function doNext(event, api) {
  var senderID = event.senderID;
  var threadID = event.threadID;
  state.getCurrentState(senderID, function(err, result) {
    if (err) throw (err);
    if (result !== 'connecting') {
      console.log('Not in the connecting state');

      // Not in the connecting state
    } else if (result === 'connecting') {
      console.log('In the connecting state');
      quota.getCurrentQuota(senderID, (err, result) => {
        if (result.quota > 0) {
          setWaitingState(senderID, (err, success) => {
            if (err) throw (err);
            if (success) {
              api.sendMessage('Starting chat', threadID);
              console.log('Starting chat');
            } else {
              api.sendMessage('Nobody here', threadID);
            }
          });

        } else {
          setInitialState(id, (err, success) => {
            if (err) throw (err);
            if (success) {
              api.sendMessage('Starting chat', threadID);
              console.log('setInitialState success');
            }
          });
        }

      });
    }
  });
}

function doInvited(event, api) {

  var senderID = event.senderID;
  var threadID = event.threadID;
  state.getCurrentState(senderID, function(err, state) {
    if (err) throw (err);

    console.log(state);
    if (state === 'connected') {
      invite.sendInvite(senderID, (err, res) => {
        if (err) throw (err);
        if (res.acptA === true && res.acptB === true) {
          console.log('Congrat!!!!!!!!');
          if (senderID === res.uidA) {
            console.log(`Congrat!!!!!!!! your friends: https://www.facebook.com/${res.uidB}`);
            api.sendMessage(`friends: https://www.facebook.com/${res.uidB}`, threadID);
            api.sendMessage(`friends: https://www.facebook.com/${res.uidA}`, res.uidB);
          }else {
            console.log(`Congrat!!!!!!!! your friends: https://www.facebook.com/${res.uidA}`);
            api.sendMessage(`friends: https://www.facebook.com/${res.uidA}`, threadID);
            api.sendMessage(`friends: https://www.facebook.com/${res.uidB}`, res.uidA);
          }
        } else {
          console.log('Your invitation has been saved! >_< ');
          api.sendMessage(`Your invitation has been saved! >_< `, threadID);
        }
      });
    }else {
      console.log(state);
    }
  });
}

module.exports.doChat = doChat;
module.exports.doLeave = doLeave;
module.exports.doNext = doNext;
module.exports.doInvited = doInvited;
