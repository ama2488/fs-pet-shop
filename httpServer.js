'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json')
var port = process.env.PORT || 8000;

var data = fs.readFileSync(petsPath,'utf-8');
var petRegExp = /^\/pets(.*)$/;
function error (res, err, code) {res.statusCode = code;
  res.setHeader('Content-Type', 'text/plain');
  res.end(err);
}

var server = http.createServer(function(req, res){
  var reqArr = req.url.split('/');
  var index = parseInt(reqArr[reqArr.length-1],10);
  // var path = reqArr[1];
  if(req.method === 'GET' && petRegExp.test(req.url)){
    if(index>=0 && index<JSON.parse(data).length){
      res.setHeader('Content-Type', 'application/json');
      var pets = JSON.parse(data);
      var petsJSON = JSON.stringify(pets[index]);
      res.end(petsJSON);
    } else if(!index) {
      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    } else {
      error(res,'Not Found', 404);
    }
  } else if (req.method === 'POST' && petRegExp.test(req.url)){
    var body = '';
    req.on('data', function() {
        body += data;
    });
    req.on('end', function() {
        body = JSON.parse(body);
        if (!body.age || !body.name || !body.kind){
          error(res,'Bad Request', 400);
        } else {
          var pets = JSON.parse(data);
          pets.push(body);
          var petsJSON = JSON.stringify(pets);
          fs.writeFile(petsPath,petsJSON,function(){console.log('written!')});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        }
    });
  } else {
    error(res,'Not Found', 404);
  }
});

server.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = server;