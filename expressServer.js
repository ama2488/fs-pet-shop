

const fs = require('fs');
const path = require('path');
const express = require('express');
const parser = require('body-parser');

const petsPath = path.join(__dirname, 'pets.json');
const port = process.env.PORT || 8000;
const data = fs.readFileSync(petsPath, 'utf-8');
const petData = JSON.parse(data);

const app = express();
app.disable('x-powered-by');
app.use(parser.json());

app.route('/pets')
.get((req, res) => {
  res.send(petData);
})
.post((req, res) => {
  if (req.body.age && req.body.name && req.body.kind) {
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
