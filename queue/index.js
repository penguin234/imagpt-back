const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const processors = require('./master');


app.get('/', function (req, res) {
  res.sendFile( __dirname + "/pages/" + "index.html" );
});


let id = 0;
function GetId() {
  let res = id;
  id++;
  return res;
}

const waitings = {};

app.post('/quest', function(req, res) {
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