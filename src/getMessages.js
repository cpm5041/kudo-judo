const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN);

const userMap = {};

const getUserInfo = async (userId) => {
  const res = await web.users.info({
    token: process.env.SLACK_TOKEN,
    user: userId,
  });
  userMap[userId] = res.user.real_name;
  return {
    name: res.user.real_name,
    image: res.user.profile.image_192,
  };
};

const getKudosRecipient = async (message) => {
  const userId = message.substr(message.indexOf('@') + 1, 9); // need to get userId from message.text
  const recipient = await getUserInfo(userId);
  return recipient;
};

const parseUserId = userId => userId.slice(2, userId.length - 1);

const getProperMessage = (message) => {
  const stringArray = message.split(' ');
  for (let i = 0; i < stringArray.length; i++) {
    const phrase = stringArray[i];

    if (phrase.match(/<@[A-Z0-9]{0,9}>/)) {
      const userId = parseUserId(stringArray[i]);
      if (!userMap[userId]) {
        getUserInfo(userId);
      }
      stringArray[i] = userMap[userId];
    }
  }
  return stringArray.join(' ').replace(/<#CHDNY8J0M\|kudos>/g, '#kudos');
};

const getKudosMessages = async (allMessages) => {
  const messagesWithUserInfo = allMessages
    .filter(message => message.text.includes('<#CHDNY8J0M|kudos>') && message.text.includes('@'))
    .map(async (message) => {
      const timestamp = new Date(parseInt(message.ts.split('.')[0], 10));
      const userInfo = await getUserInfo(message.user);
      return {
        text: getProperMessage(message.text),
        author: userInfo,
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
