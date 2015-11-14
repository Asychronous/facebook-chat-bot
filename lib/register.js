'use strict';
var login = require('facebook-chat-api');
var request = require('request');
var conf = require('./config.js');

function setRegister(uid, gender, callback) {
  request.post(
    {
      url: `${conf.DATABASE}/rest/api/v1/pool/account/register`,
      body: {
        uid: uid,
        'e_address': 'test@gmail.com',
        gender: gender,
      },
      json: true,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('setRegister success');
        callback(null, true);
      } else {
        callback(new Error(error));
      }
    });

}

module.exports.setRegister = setRegister;
