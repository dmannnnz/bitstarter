var fs = require('fs');

var err = false;
var data = '';
/*
var buffer = new Buffer(data);
fs.readFileSync("index.html", function(err, data) {
    if (err) throw err;
    console.log(data);
});
*/
var buffer = fs.readFileSync('index.html');
var out = buffer.toString();

console.log("out: " + out);
