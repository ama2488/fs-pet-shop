

const http = require('http');
const fs = require('fs');
const path = require('path');

const petsPath = path.join(__dirname, 'pets.json');
const port = process.env.PORT || 8000;
const data = fs.readFileSync(petsPath, 'utf-8');
const myData = JSON.parse(data);
const petRegExp = /^\/pets(.*)$/;
function error(res, err, code) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'text/plain');
  res.end(err);
}

const server = http.createServer((req, res) => {
  const reqArr = req.url.split('/');
  const index = parseInt(reqArr[reqArr.length - 1], 10);
  if (req.method === 'GET' && petRegExp.test(req.url)) {
    if (index >= 0 && index < myData.length) {
      res.setHeader('Content-Type', 'application/json');
      const petsJSON = JSON.stringify(myData[index]);
      res.end(petsJSON);
    } else if (!index) {
      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    } else {
      error(res, 'Not Found', 404);
    }
  } else if (req.method === 'POST' && petRegExp.test(req.url)) {
    let body = '';
    req.on('data', (d) => {
      body += d;
    });
    req.on('end', () => {
      body = JSON.parse(body);
      if (body.age && body.name && body.kind) {
        const pets = myData;
        pets.push(body);
        const petsJSON = JSON.stringify(pets);
        fs.writeFile(petsPath, petsJSON, () => {});
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      } else {
        error(res, 'Bad Request', 400);
      }
    });
  } else {
    error(res, 'Not Found', 404);
  }
});

server.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = server;
