'use strict';
var request = require('request');
var conf = require('./config.js');
var quota = require('./quota.js');

// setInitialState(id, (err, result) => {
//   if (err) throw (err);
//   if (result) {
//   }
// });

// setConnectingState(id, (err, result) => {
//   if (err) throw (err);
//   if (result) {
//   }
// });

// setWaitingState(id, (err, result) => {
//   if (err) throw (err);
//   if (result) {
//   }
// });

// getCurrentState(id, (err, result) => {
//   if (err) throw (err);
//   if (result === 'initial') {
//
//   } else if (result === 'connecting') {
//
//   } else if (result === 'waiting') {
//
//   }
// });

function setWaitingState(id, callback) {
  // console.log(`PUT ${conf.DATABASE}/rest/api/v1/${id}/state`);
  request.put(
    {
      url: `${conf.DATABASE}/rest/api/v1/pool/${id}/state`,
      body: {
        state: 'waiting',
      },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // set waiting state succes and get pair
        // quota minus
        quota.reduceQuota(id, (err, success) => {
          if (err) throw (err);
          if (success) {
            console.log('quota reduce success');

            // put the state 'connecting'
            setConnectingState(id, state, (err, success) => {
              if (err) throw (err);
              console.log('set state "connect"');
              if (success) {
                callback(null, true);
              }
            });
          }
        });

      } else if (!error && response.statusCode === 204) {
        // set waiting state success but not get pair
        // put the state 'initial'
        setInitialState(id, state, (err, result) => {
          if (err) throw (err);
          if (success) {
            console.log('set state "initial"');
            callback(null, false);
          }
        });
      } else {
        callback(new Error(error));
      }
    });
}

function setConnectingState(id, callback) {
  // console.log(`PUT ${conf.DATABASE}/rest/api/v1/${id}/state`);
  request.put(
    {
      url: `${conf.DATABASE}/rest/api/v1/pool/${id}/state`,
      body: {
        state: 'connecting',
      },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(null, true);
      } else {
        callback(new Error(error));
      }
    });
}

function setInitialState(id, callback) {
  // console.log(`PUT ${conf.DATABASE}/rest/api/v1/${id}/state`);
  request.put(
    {
      url: `${conf.DATABASE}/rest/api/v1/pool/${id}/state`,
      body: {
        state: 'initial',
      },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(null, true);
      } else {
        callback(new Error(error));
      }
    });
}

function getCurrentState(id, callback) {
  console.log(`${conf.DATABASE}/rest/api/v1/pool/${id}/state`);
  request.get(
    {
      url: `${conf.DATABASE}/rest/api/v1/pool/${id}/state`,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        var res = JSON.parse(body);
        callback(null, res.state);
      } else {
        callback(new Error(error));
      }
    });
}

module.exports.setWaitingState = setWaitingState;
module.exports.setConnectingState = setConnectingState;
module.exports.setInitialState = setInitialState;
module.exports.getCurrentState = getCurrentState;
