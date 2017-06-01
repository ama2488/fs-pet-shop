

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

var petsPath = path.join(__dirname, 'pets.json');
var port = process.env.PORT || 8000;
var data = fs.readFileSync(petsPath,'utf-8');
var petData = JSON.parse(data);

app.disable('x-powered-by');

app.route('/pets')
.get(function (req, res) {
  res.send(petData);
})
.post(function (req, res) {
  console.log(req.body);
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    body = JSON.parse(body);
    if (body.age && body.name && body.kind){
      var pets = petData;
      pets.push(body);
      var petsJSON = JSON.stringify(pets);
      fs.writeFileSync(petsPath,petsJSON);
      res.set('Content-type', 'application/json');
      res.send(JSON.stringify(body));
    } else {
      res.sendStatus(400);
    }
  });
})

app.get('/pets/:id', function(req,res){
  var id = req.params.id;
  if (id < 0 || id >= petData.length || isNaN(id)) {
    return res.sendStatus(404);
  };
  res.set('Content-type', 'application/json');
  res.send(petData[id]);
})

app.use(function(req, res){
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
