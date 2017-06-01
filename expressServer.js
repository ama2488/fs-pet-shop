

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var data = fs.readFileSync(petsPath,'utf-8');
var petData = JSON.parse(data);

app.disable('x-powered-by');

app.get('/pets', function(req, res) {
    res.send(petData);
  });

app.get('/pets/:id', function(req,res){
  var id = req.params.id;
  if (id < 0 || id >= petData.length || Number.isNaN(id)) {
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
