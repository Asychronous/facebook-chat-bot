'use strict';
var request = require('request');
var conf = require('./config.js');

function getCurrentPeer(id, callback) {
  // console.log(`GET ${conf.DATABASE}/rest/api/v1/account/${id}/quota`);
  request.get(
    {
      url: `${conf.DATABASE}/rest/api/v1/account/${id}/quota`,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        var res = JSON.parse(body);
        callback(null, res);
      } else {
        callback(new Error(error));
      }
    });
}

module.exports.getCurrentPeer = getCurrentPeer;
