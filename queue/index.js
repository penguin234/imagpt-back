const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const processors = require('./master');


const Manager = require('./worker/manager');
const Distributor = require('./work/distributor');


// temporal apis

const quests = {};
let quest_id = 0;

app.post('/makequest', function (req, res) {
  const token = req.body.token;

  if (!token) {
    res.sendStatus(500);
    return;
  }

  quest_id++;
  quests[quest_id] = {
    id: quest_id,
    token: token
  };

  res.json({
    id: quest_id
  });
});

app.post('/postimage', function (req, res) {
  /*
  const { image } = req.files;

  if (!image) {
    return res.json({
      result: 'fail',
      err: 'no file recieved'
    });
  }
  */

  res.json({
    result: 'success'
  });
});

app.post('/quest', function (req, res) {
  const token = req.body.token;
  if (!token) {
    res.sendStatus(500);
    return;
  }

  const id = req.body.id;
  if (!id) {
    res.sendStatus(500);
    return;
  }

  if (quests[id].token != token) {
    res.sendStatus(500);
    return;
  }

  let question = req.body.question;
  if (!question) {
    res.sendStatus(500);
    return;
  }

  res.json({
    answer: question + question
  });
});


app.get('/hello', function (req, res) {
  res.send('Hello, imagpt');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});