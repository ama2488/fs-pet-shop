

const fs = require('fs');
const path = require('path');
const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const basicAuth = require('basic-auth');

const petsPath = 'pets.json';
const port = process.env.PORT || 8000;
let data = fs.readFileSync(petsPath, 'utf-8');
let petData = JSON.parse(data);

const app = express();
app.disable('x-powered-by');
app.use(parser.json());
app.use(morgan('short'));

app.route('/pets')
.get((req, res) => {
  if (!basicAuth(req)) {
    res.set('WWW-Authenticate', 'Basic realm="Required"');
    return res.sendStatus(401);
  }
  res.send(petData);
})
.post((req, res) => {
  if (req.body.age && req.body.name && req.body.kind && !isNaN(req.body.age)) {
    petData.push(req.body);
    const petsJSON = JSON.stringify(petData);
    fs.writeFileSync(petsPath, petsJSON);
    res.send(req.body);
  } else {
    res.sendStatus(400);
  }
});

app.route('/pets/:id')
.get((req, res) => {
  const id = req.params.id;
  if (id < 0 || id >= petData.length || isNaN(id)) {
    return res.sendStatus(404);
  }
  res.send(petData[id]);
})
.patch((req, res) => {
  data = fs.readFileSync(petsPath, 'utf-8');
  petData = JSON.parse(data);
  const id = req.params.id;
  if (req.body.name || req.body.kind || !isNaN(req.body.age)) {
    if (req.body.name) {
      petData[id].name = req.body.name;
    }
    if (req.body.kind) {
      petData[id].kind = req.body.kind;
    }
    if (!isNaN(req.body.age)) {
      petData[id].age = req.body.age;
    }
    const petsJSON = JSON.stringify(petData);
    fs.writeFileSync(petsPath, petsJSON);
    console.log(petData[id]);
    res.send(petData[id]);
  } else {
    res.sendStatus(400);
  }
})
.delete((req, res) => {
  data = fs.readFileSync(petsPath, 'utf-8');
  petData = JSON.parse(data);
  const id = req.params.id;
  const deleted = petData.splice(id, 1);
  const petsJSON = JSON.stringify(petData);
  fs.writeFileSync(petsPath, petsJSON);
  res.send(deleted[0]);
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Listening on port, ${port}`);
});

module.exports = app;
