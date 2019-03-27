const express = require('express');
const slack = require('slack');

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});
app.get('/messages', (req, res) => {
  const messages = [];
  res.status(200).send(messages);
});
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
