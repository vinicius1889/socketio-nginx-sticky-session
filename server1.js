  var http = require("http")
  var mongoose = require('mongoose');
  var app = require("express")();
  var server = require("http").createServer(app);
  var io = require("socket.io").listen(server);

  var port = 5060;
  server.listen(port);

  mongoose.connect('mongodb://172.17.0.2:27017/icarros');


  var onlineUsersSchema = new mongoose.Schema({
      token:String,
      login:String
  })

  var dadosParaRetornoSchema = new mongoose.Schema({
      item1:String,
      item2:String
  })

  var OnlineUsers = mongoose.model('online_users',onlineUsersSchema);

  var Itens = mongoose.model('dados_icarros',dadosParaRetornoSchema);

  app.get('/',function(req,res){
    console.log('porta = '+port)

      res.sendFile(__dirname+'/index.html');
  });

  io.on('connection',function(socket){
      console.log('>>>>connection in '+port);
      socket.emit('registered',{id:socket.id});
      socket.on('atualizaDados',function(data){
          adicionarUsuarioOnline(data);
      });

      socket.on('disconnect',function(){
          removeUsuarioOnline(socket.id);
      });

      setInterval(function(){
          retornaDadosRecursivamente(socket);
      },10000);

  })

  function retornaDadosRecursivamente(socket){
      OnlineUsers.find({token:socket.id},function(err,data){
          Itens.find({login:data.login},function(err,data){
              socket.emit('dadosAtualizados',data);
          });
      })
  };

  function isUserOnline(data,callback){
    OnlineUsers.find(data,function(err,data){
        callback(data);
    })
  }

  function removeUsuarioOnline(token){
    OnlineUsers.findOneAndRemove({token:token},function(err,data){
    });
  };



  function adicionarUsuarioOnline(data){
      var item = new OnlineUsers();
      item.token = data.token;
      item.login = data.login;
      item.save();


  }
