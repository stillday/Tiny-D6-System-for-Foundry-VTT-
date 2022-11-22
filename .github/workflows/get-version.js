var fs = require('fs');
console.log(JSON.parse(fs.readFileSync('supers/system.json', 'utf8')).version);
