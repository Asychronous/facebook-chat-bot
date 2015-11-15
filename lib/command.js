'use strict';
var request = require('request');
var state = require('./state.js');
var invite = require('./invite.js');
var quota = require('./quota.js');
var register = require('./register.js');
var peer = require('./peer.js');

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
  state.getCurrentState(senderID, function(err, result) {
    if (err) throw (err);
    if (result === 'connected') {
      peer.getCurrentPeer(senderID, function(err, peerRes) {
        api.sendMessage('Oh NO your partner left!!!', peerRes.peer);
        state.setInitialState(senderID, (err, success) => {
          if (err) throw (err);
          if (success) {
            api.sendMessage('You have left the chat', threadID);
            state.setInitialState(peerRes.peer, (err, success) => {
              if (err) throw (err);
              if (success) {
                api.sendMessage('You have left the chat', peerRes.peer);
              } else {
                console.log(peerRes.peer);

                // api.sendMessage('Left Failed!', threadID);
              }
            });
          } else {
            console.log(threadID);

            // api.sendMessage('Left Failed!', threadID);
          }
        });
      });

    }
  });
}

function doNext(event, api) {
  var senderID = event.senderID;
  var threadID = event.threadID;
  state.getCurrentState(senderID, function(err, result) {
    if (err) throw (err);
    if (result !== 'connected') {
      console.log('Not in the connected state');

      // Not in the connected state
    } else if (result === 'connected') {
      console.log('In the connected state');
      quota.getCurrentQuota(senderID, (err, result) => {
        if (result.quota > 0) {
          state.setWaitingState(senderID, (err, success) => {
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
  state.getCurrentState(senderID, function(err, result) {
    if (err) throw (err);

    console.log(result);
    if (result === 'connected') {
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
      console.log(result);
    }
  });
}

function doMessage(event, api) {
  var senderID = event.senderID;
  var threadID = event.threadID;
  state.getCurrentState(senderID, function(err, result) {
    if (err) throw (err);
    if (result === 'connected') {
      peer.getCurrentPeer(senderID, function(err, res) {
        if (err) throw (err);
        var reply = {};
        reply.body = event.body; //copy text
        if (event.attachments.length > 0) {
          console.log(event.attachments[0]);
          if (event.attachments[0].stickerID) {
            reply.sticker = event.attachments[0].stickerID;
          } else if (event.attachments[0].url) {
            reply.attachment = event.attachments[0].url;
          }

        }

        console.log(reply);
        api.sendMessage(reply, res.peer); // send to peer
      });

    }else {
      api.sendMessage(`What are you doing (mad) !!!!!!!`, threadID);
    }
  });
}

function doRegister(event, api) {
  var senderID = event.senderID;
  api.getUserInfo(senderID, function(err, ret) {
    if (!err) {
      register.setRegister(senderID, ret[senderID].gender, function(err, result) {
        if (!err) {
          console.log(senderID + ' has been registered!');
        } else {
          console.log(err);
        }
      });
    }

  });

}

module.exports.doChat = doChat;
module.exports.doLeave = doLeave;
module.exports.doNext = doNext;
module.exports.doInvited = doInvited;
module.exports.doMessage = doMessage;
module.exports.doRegister = doRegister;
