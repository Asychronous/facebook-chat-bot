'use strict';
var login = require('facebook-chat-api');
var request = require('request');
var conf = require('./config.js');

function setRegister(uid, gender, callback) {
  if (!err) {
    request.post(
      {
        url: `${conf.DATABASE}/rest/api/v1/pool/account/register`,
        body: userInfo,
        json: true,
      },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          callback(null, true);
        } else {
          callback(new Error(error));
        }
      });
  }

}

module.exports.setRegister = setRegister;
