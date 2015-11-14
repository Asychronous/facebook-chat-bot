'use strict';
var request = require('request');
var conf = require('./config.js');

// setInitialState(id, state, (err, result) => {
//   if (err) throw (err);
//   if (result) {
//   }
// });

// setConnectingState(id, state, (err, result) => {
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
      url: `${conf.DATABASE}/rest/api/v1/${id}/state`,
      body: {
        state: 'waiting',
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

function setConnectingState(id, callback) {
  // console.log(`PUT ${conf.DATABASE}/rest/api/v1/${id}/state`);
  request.put(
    {
      url: `${conf.DATABASE}/rest/api/v1/${id}/state`,
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
      url: `${conf.DATABASE}/rest/api/v1/${id}/state`,
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
  // console.log(`${conf.DATABASE}/rest/api/v1/${id}/state`);
  request.get(
    {
      url: `${conf.DATABASE}/rest/api/v1/${id}/state`,
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
