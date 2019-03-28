const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN);

const getUserInfo = async (userId) => {
  const res = await web.users.info({
    token: process.env.SLACK_TOKEN,
    user: userId,
  });
  return {
    name: res.user.real_name,
    image: res.user.profile.image_192,
  };
};

const getKudosRecipient = async (message) => {
  const userId = message.substr(message.indexOf('@') + 1, 9); // need to get userId from message.text
  console.log('message', message);
  console.log('user id', userId);
  const recipient = await getUserInfo(userId);
  return recipient;
};

const getKudosMessages = async (allMessages) => {
  const messagesWithUserInfo = allMessages
    .filter(message => message.text.includes('<#CHDNY8J0M|kudos>') && message.text.includes('@'))
    .map(async (message) => {
      const timestamp = new Date(parseInt(message.ts.split('.')[0], 10));
      return {
        text: message.text,
        author: await getUserInfo(message.user),
        timestamp,
        recipient: await getKudosRecipient(message.text),
      };
    });

  const parsedMessages = await Promise.all(messagesWithUserInfo);
  return parsedMessages;
};

const messages = async () => {
  const res = await web.channels.history({
    token: process.env.SLACK_TOKEN,
    channel: 'CHDNY8J0M',
  });
  return getKudosMessages(res.messages);
};


module.exports = {
  messages,
};
