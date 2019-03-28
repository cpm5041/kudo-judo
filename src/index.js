const express = require('express');
require('dotenv').config();
const getMessages = require('./getMessages');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});
app.get('/messages', async (req, res) => {
  const messages = await getMessages.messages();
  console.log(messages);
  res.status(200).send(messages);
});
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
