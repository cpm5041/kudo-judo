const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN);
console.log(process.env.SLACK_TOKEN);

const obj = {
  token: process.env.SLACK_TOKEN,
  channel: 'C8Y9XS139',
};

const messages = (async () => {
  // See: https://api.slack.com/methods/conversations.list
  const res = await web.conversations.list({
    exclude_archived: true,
    types: 'public_channel',
    // Only get first 100 items
    limit: 100,
  });

  // `res.channels` is an array of channel info objects
  console.log(res.channels);
})();

module.exports = {
  messages,
};
