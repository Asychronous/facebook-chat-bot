var login = require('facebook-chat-api');

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
          doChat(event, function(err, result) {
            if (err) {
              console.log(err);
            }
          });
        } else if (event.body === '#invite') {
          doInvite(event);
        } else if (event.body === '#leave') {
          doLeave(event);
        } else if (event.body === '#next') {
          doNext();
        }

        break;
      case 'event':
        console.log(event);
        break;
    }

  });
});
