'use strict';
var request = require('request');
var conf = require('./config.js');

// sendInvite(id, (err, result) => {
//   if (err) throw (err);
//   result.uid
// });

function sendInvite(id, callback) {
  request.put(
    {
      url: '${conf.DATABASE}rest/v1/invited',
      body: {
        uuid: id,
      },
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

module.exports.sendInvite = sendInvite;
