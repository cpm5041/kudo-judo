const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
require('dotenv').config();
const getMessages = require('./getMessages');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(basicAuth({
  users: { [process.env.SERVER_USERNAME]: process.env.SERVER_PASSWORD },
}));

app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});
app.get('/messages', async (req, res) => {
  const messages = await getMessages.messages();
  res.status(200).send(messages);
});
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
