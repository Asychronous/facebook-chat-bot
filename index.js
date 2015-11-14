var login = require('facebook-chat-api');
var command = require('./lib/command.js');
var config = require('./lib/config.js');

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
          command.doNext(event, api);
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
