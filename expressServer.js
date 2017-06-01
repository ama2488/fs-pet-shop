'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const petsPath = path.join(__dirname, 'pets.json');
const port = process.env.PORT || 8000;
const data = fs.readFileSync(petsPath,'utf-8');
const petData = JSON.parse(data);

app.disable('x-powered-by');

app.route('/pets')
.get((req, res) => {
  res.send(petData);
})
.post((req, res) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    body = JSON.parse(body);
    if (body.age && body.name && body.kind){
      let pets = petData;
      pets.push(body);
      let petsJSON = JSON.stringify(pets);
      fs.writeFileSync(petsPath,petsJSON);
      res.set('Content-type', 'application/json');
      res.send(JSON.stringify(body));
    } else {
      res.sendStatus(400);
    }
  });
})

app.get('/pets/:id',(req,res) => {
  let id = req.params.id;
  if (id < 0 || id >= petData.length || isNaN(id)) {
    return res.sendStatus(404);
  };
  res.set('Content-type', 'application/json');
  res.send(petData[id]);
})

app.use((req, res)=>{
  res.sendStatus(404);
});

app.listen(port,()=> {
  console.log(`Listening on port, ${port}`);
});

module.exports = app;
