const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN);
console.log(process.env.SLACK_TOKEN);

const obj = {
  token: process.env.SLACK_TOKEN,
  channel: 'CHDNY8J0M',
};

const getUserInfo = async (userId) => {
  const res = await web.users.info({
    token: process.env.SLACK_TOKEN,
    user: userId,
  });
  return res.user;
};

const getKudosMessages = allMessages => allMessages
  .map(async message => ({ text: message.text, user: await getUserInfo(message.user), ts: message.ts }))
  .filter(message => message.text.includes('<#CHDNY8J0M|kudos>'));

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
