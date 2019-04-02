const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN);

const userMap = {};
const parseUserId = userId => userId.slice(2, userId.length - 1);

const getUserInfo = async (userId) => {
  if (!userMap[userId]) {
    const res = await web.users.info({
      token: process.env.SLACK_TOKEN,
      user: userId,
    });
    userMap[userId] = {
      name: res.user.real_name,
      image: res.user.profile.image_192,
    };
  }
  return userMap[userId];
};

const replaceUserNames = message => message.map((phrase) => {
  if (phrase.match(/<@[A-Z0-9]{0,9}>/)) {
    const userId = parseUserId(phrase);
    return userMap[userId].name;
  }
  return phrase;
}).join(' ');

const getUserInfoForKudosRecipients = async (message) => {
  const regex = new RegExp(`<#${process.env.CHANNEL_ID}\\|kudos>`, 'g');
  const stringArray = message.replace(regex, '#kudos').split(' ');
  const userIds = [];
  for (let i = 0; i < stringArray.length; i++) {
    const phrase = stringArray[i];

    if (phrase.match(/<@[A-Z0-9]{0,9}>/)) {
      const userId = parseUserId(stringArray[i]);
      userIds.push(userId);
    }
  }
  const recipients = await Promise.all(userIds.map(async (userId) => {
    const resolved = await getUserInfo(userId);
    return resolved;
  }));

  return {
    formattedKudos: replaceUserNames(stringArray),
    recipients,
  };
};

const getKudosMessages = async (allMessages) => {
  const messagesWithUserInfo = allMessages
    .filter(message => message.text.includes(`<#${process.env.CHANNEL_ID}|kudos>`) && message.text.includes('@'))
    .map(async (message) => {
      const timestamp = new Date(parseInt(message.ts.split('.')[0], 10));
      const authorInfo = await getUserInfo(message.user);
      const kudos = await getUserInfoForKudosRecipients(message.text);
      return {
        text: kudos.formattedKudos,
        author: authorInfo,
        timestamp,
        recipients: kudos.recipients,
      };
    });

  const parsedMessages = await Promise.all(messagesWithUserInfo);
  return parsedMessages;
};


const messages = async () => {
  const res = await web.channels.history({
    token: process.env.SLACK_TOKEN,
    channel: process.env.CHANNEL_ID,
  });
  return getKudosMessages(res.messages);
};


module.exports = {
  messages,
};
