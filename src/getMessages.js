const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN);
console.log(process.env.SLACK_TOKEN);

const obj = {
  token: process.env.SLACK_TOKEN,
  channel: 'CHDNY8J0M',
};

const getKudosMessages = allMessages => allMessages.map(message => ({ text: message.text, user: message.user })).filter(message => message.text.includes('<#CHDNY8J0M|kudos>'));

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
