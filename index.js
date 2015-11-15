var login = require('facebook-chat-api');
var command = require('./lib/command.js');
var request = require('request');
var config = require('./lib/config.js');

function pangu(callback) {
  request.del(
    {
      url: `${config.DATABASE}/rest/api/v1/account/pangu`,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(null, true);
      } else {
        callback(new Error(error));
      }
    });
}

pangu((err, res) => {
  if (!err && res) {
    console.log('Pangu GO!');
  }
});

login(config.FACEBOOK, function callback(err, api) {
  if (err) return console.error(err);

  api.listen(function callback(err, event) {

    switch (event.type) {

      case 'message':
        if (event.body === '#chat') {
          command.doChat(event, api);
        } else if (event.body === '#invite') {
          command.doInvited(event, api);
        } else if (event.body === '#leave') {
          command.doLeave(event, api);
        } else if (event.body === '#next') {
          // command.doLeave(event, api);
          // api.sendMessage('Not implement feature! :( Try typing #chat to find someone again!', event.threadID);
          // console.log('Not implement feature!');
          command.doNext(event, api);
        } else if (event.body === '#register') {
          command.doRegister(event, api);
        } else {
          command.doMessage(event, api);
        }

        break;
      case 'event':
        console.log(event);
        break;
    }

  });
});
