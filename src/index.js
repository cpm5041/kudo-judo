const express = require('express');
const basicAuth = require('express-basic-auth');
require('dotenv').config();
const getMessages = require('./getMessages');


const app = express();
const port = process.env.PORT || 3000;

app.use(basicAuth({
  users: { [process.env.SERVER_USERNAME]: process.env.SERVER_PASSWORD },
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://kudos-wallboard.herokuapp.com');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
