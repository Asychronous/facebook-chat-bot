'use strict';
var request = require('request');
var conf = require('./config.js');

// reduceQuota(id, (err, success) => {
//   if (err) throw (err);
//   if (success) {
//   }
// });

// getCurrentQuota(id, (err, result) => {
//   if (err) throw (err);
//   console.log(result);
// });

function reduceQuota(id, callback) {
  // console.log(`PUT ${conf.DATABASE}/rest/api/v1/account/${id}/quota`);
  request.put(
    {
      url: `${conf.DATABASE}/rest/api/v1/account/${id}/quota`,
      body: {
        action: 'minus',
      },
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

function getCurrentQuota(id, callback) {
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

module.exports.reduceQuota = reduceQuota;
module.exports.getCurrentQuota = getCurrentQuota;
