function makeServer(done) {
  var express = require('express');
  var path = require('path');
  var app = express();

  app.get('/', function (req, res) {
  	res.status(200).sendFile(`index.html`, {root: path.resolve()});
  });

  /* serves all the static files */
  app.get(/^(.+)$/, function(req, res){
      console.log('static file request : ' + req.params);
      res.sendfile( __dirname + req.params[0]);
  });

  var server = app.listen(3000, function () {
  	var port = server.address().port;
  	done()
  });
  return server;
}
module.exports = makeServer;
