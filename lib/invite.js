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
      url: `${conf.DATABASE}/rest/api/v1/connection/invited`,
      body: {
        uid: id,
      },
      json:true,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(body);
        callback(null, body);
      } else {
        callback(new Error(error));
      }
    });
}

module.exports.sendInvite = sendInvite;
