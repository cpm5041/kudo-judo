const express = require('express');

const app = express();
process.env.PORT = 3000;
const port = process.env.PORT;
app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
