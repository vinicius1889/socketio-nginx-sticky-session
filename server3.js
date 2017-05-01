var http = require("http")
var mongoose = require('mongoose');

  var app = require("express")();
  var server = require("http").createServer(app);
  var io = require("socket.io").listen(server);

  var port = 5062;
  server.listen(port);

  app.get('/',function(req,res){
    console.log('porta = '+port)

      res.sendFile(__dirname+'/index.html');
  });

  io.on('connection',function(socket){
      console.log('>>>>connection in '+port);
   })
