

const fs = require('fs');
const path = require('path');
const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');

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
  data = fs.readFileSync(petsPath, 'utf-8');
  petData = JSON.parse(data);
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

app.get('/pets/:id', (req, res) => {
  const id = req.params.id;
  if (id < 0 || id >= petData.length || isNaN(id)) {
    return res.sendStatus(404);
  }
  res.send(petData[id]);
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Listening on port, ${port}`);
});

module.exports = app;
