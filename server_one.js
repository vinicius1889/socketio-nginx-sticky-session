var http = require("http")
var mongoose = require('mongoose');

  var app = require("express")();
  var server = require("http").createServer(app);
  var io = require("socket.io").listen(server);

  server.listen(5055);

  app.get('/',function(req,res){
      res.sendFile(__dirname+'/index.html');
  });



  io.on('connection',function(socket){
      console.log('>>>>connection')
      socket.emit('registered',{'id':socket.id});
      socket.on('atualizaDados',function(data){
          console.log('   >>>>>atualizando dados')
          adicionaUsuarioOnline(data);

          /*setInterval(function(){
              var dados = {
                  nome:'vinicius',
                  dias:"dias",
                  id:socket.id
              }
              socket.emit("dadosAtualizados",dados);
          },2000);
          */
      });

  })

  var mongoose = require('mongoose');


  mongoose.connect('mongodb://172.17.0.2:27017/icarros');
  var onlineUsersSchema = new mongoose.Schema({
      token:String,
      login:String
  })

  var OnlineUsers = mongoose.model('online_users',onlineUsersSchema);


    function adicionaUsuarioOnline(usuario){
        var user = new OnlineUsers();
        user.login = usuario.login;
        user.token = usuario.token;
        user.save(function(r,d){
          console.log(d);
        });
    }
