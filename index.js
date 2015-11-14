var login = require('facebook-chat-api');
var command = require('./lib/command.js');

var option = {
  email: 'venus.doe.love@gmail.com',
  password: 'async=hackerthon',
};

login(option, function callback(err, api) {
  if (err) return console.error(err);

  api.listen(function callback(err, event) {

    switch (event.type) {
      case 'message':
        if (event.body === '#chat') {
          command.doChat(event, function(err, success) {
          });
        } else if (event.body === '#invite') {
          command.doInvite(event, api);
        } else if (event.body === '#leave') {
          command.doLeave(event, api);
        } else if (event.body === '#next') {
          command.doNext();
        }

        break;
      case 'event':
        console.log(event);
        break;
    }

  });
});
