const express = require('express');
const basicAuth = require('express-basic-auth');
require('dotenv').config();
const getMessages = require('./getMessages');


const app = express();
const port = process.env.PORT || 3000;

app.use(basicAuth({
  users: { kudojudo: 'liberty1' },
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://kudos-wallboard.herokuapp.com');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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
