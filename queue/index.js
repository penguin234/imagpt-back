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
  if (!token) {
    res.sendStatus(500);
    return;
  }

  if (quests[id].token != token) {
    res.sendStatus(500);
    return;
  }

  res.json({
    answer: 'congratualations!'
  });
});


app.get('/', function (req, res) {
  res.sendFile( __dirname + "/pages/" + "index.html" );
});


app.get('/hello', function (req, res) {
  res.send('Hello, imagpt');
});


let id = 0;
function GetId() {
  let res = id;
  id++;
  return res;
}

const waitings = {};

app.post('/quest_old', function(req, res) {
  let question = req.body.question;
  let id = GetId();

  waitings[id] = { 
    question: question
  };

  res.json({
    id: id
  });
});


app.post('/image', function(req, res) {
  const { image } = req.files;
  const { id } = req.body;

  if (!image) {
    return res.sendStatus(400);
  }

  let ext = image.name.split('.');
  ext = ext[ext.length - 1];
  image_name = String(id) + '.' + ext;

  image.mv(__dirname + '/../images/' + image_name, (err) => {
    if (err) {
      return res.sendStatus(400);
    }

    processors[0].Quest(image_name, waitings[id].question, (data) => {
      res.json({
        answer: data
      });
    });
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});