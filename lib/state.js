'use strict';
var request = require('request');
var conf = require('./config.js');

// setCurrentState(id, state, (err, result) => {
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

function setCurrentState(id, state, callback) {
  // console.log(`PUT ${conf.DATABASE}/rest/api/v1/${id}/state`);
  request.put(
    {
      url: `${conf.DATABASE}/rest/api/v1/${id}/state`,
      body: {
        state: state,
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

module.exports.getCurrentState = getCurrentState;
module.exports.setCurrentState = setCurrentState;
