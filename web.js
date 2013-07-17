var dynamic = true;
var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var buffer = fs.readFileSync('index.html');
var out = buffer.toString();

app.get('/', function(request, response) {
  if (dynamic) {
    response.send(out);
  } else {
    response.send('Hello World 2!');
  }
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
