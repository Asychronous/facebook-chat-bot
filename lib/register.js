'use strict';
var login = require('facebook-chat-api');
var request = require('request');
var conf = require('./config.js');

function doRegister(api, uid, email, gender) {

  api.getUserInfo(uid, function(err, ret) {
    if (!err) {
      var userInfo = {
        uid: uid,
        'e_address': 'test@gmail.com',
        gender: ret[uid].gender,
      };
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

  });

}

module.exports.doRegister = doRegister;
