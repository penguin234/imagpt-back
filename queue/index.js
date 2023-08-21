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


// worker connecting

const net = require('net');

const ipaddr = "localhost";
const worker_port = 5100;

let master = net.createServer((socket) => {
  console.log(socket.address().address + " connected");
});


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
  console.log(req.files);
  
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
    res.status(500).send('no token');
    return;
  }

  const id = req.body.id;
  if (!id) {
    res.status(500).send('no id');
    return;
  }

  if (quests[id].token != token) {
    res.status(500).send('token and id not match');
    return;
  }

  let question = req.body.question;
  if (!question) {
    res.status(500).send('no question');
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