var cluster  = require("cluster"),
      http = require("http"),
      numCPUS = require("os").cpus().length;

var mongoose = require('mongoose');

if(cluster.isMaster){
  console.log('master');
  var i = 0;
  while(i<numCPUS){
    cluster.fork();i++;
  }
  

  cluster.on("fork",function(cluster){
        console.log(cluster.process.pid)
  });
  cluster.on('listening',function(worker,address){
      console.log(worker.process.pid+" "+address.address+" "+address.port);
  })
  cluster.on('exit',function(worker,code,signal){
    console.log(worker.process+" killed");
  })


}else{
  console.log('child');

  var app = require("express")();
  var server = require("http").createServer(app);
  var io = require("socket.io").listen(server);

  var count = 0 ;

  var sockets = [];

  server.listen(5055);

  app.get('/',function(req,res){
      res.sendFile(__dirname+'/index.html');
  });



  io.on('connection',function(socket){
      console.log('>>>>connection')
      socket.emit('registered',{'id':socket.id});

      socket.on('atualizaDados',function(data){

          console.log('   >>>>>atualizando dados')

          //adicionaUsuarioOnline(data);

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




}
