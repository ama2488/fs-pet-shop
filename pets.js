
var fs = require('fs');
var path = require('path');
var petFile = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];
var index = process.argv[3];

if (cmd === 'read') {
  if (!index){
    fs.readFile(petFile, 'utf8', function(err, data) {
      if (err) {
        throw err;
      }

      var pets = JSON.parse(data);

      console.log(pets);
    });
  }
  else {
    fs.readFile(petFile, 'utf8', function(err, data) {
      if (err) {
        throw err;
      }

      var pets = JSON.parse(data);
      if (!pets[index]){
        console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
        process.exit(1);
      }
      console.log(pets[index]);
    });
  };
}
else if (cmd === 'create') {
  fs.readFile(petFile, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }

    let pets = JSON.parse(data);
    let age = process.argv[3];
    let kind = process.argv[4];
    let name = process.argv[5];

    if (!age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    pets.push({
      age: age*1,
      kind: kind,
      name:name,
    });

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petFile, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pets[pets.length-1]);
    });
  });
}
else if (cmd === 'update') {
  fs.readFile(petFile, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }

    let pets = JSON.parse(data);
    let age = process.argv[4];
    let kind = process.argv[5];
    let name = process.argv[6];

    if (!age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    pets[index] = {
      age: age*1,
      kind: kind,
      name:name,
    };

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petFile, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pets[index]);
    });
  });
} else if (cmd === 'destroy') {
  fs.readFile(petFile, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var pets = JSON.parse(data);
    if (!pets[index]){
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
    else {
      let destroyed = pets.splice(index,1);
      let petsJSON = JSON.stringify(pets);

      fs.writeFile(petFile, petsJSON, function(writeErr) {
        if (writeErr) {
          throw writeErr;
        }
        console.log(destroyed[0]);
      });
    }
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
