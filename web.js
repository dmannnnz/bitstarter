var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

fs.readFileSync('index.html', function(err, data) {
    if (err) throw err;
    console.log(data);
});
var buffer = new Buffer(data);
var out = buffer.toString();

app.get('/', function(request, response) {
  //response.send('Hello World 2!');
  response.send(out);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
