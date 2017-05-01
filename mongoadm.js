var mongoose = require('mongoose');


mongoose.connect('mongodb://172.17.0.2:27017/icarros');
var onlineUsersSchema = new mongoose.Schema({
    nome:String,
    login:String
})

var OnlineUsers = mongoose.model('online_users',onlineUsersSchema);

var item = new OnlineUsers();
item.nome="user"+new Date().getTime();
item.login = "User"+new Date().getTime();

item.save(function(err,data){
  console.log(data);
})

/*
OnlineUsers.find({'login':'123457'},function(err,OnlineUser){
    if(err){
        handleError(err);
    }
    console.log(OnlineUser);
});
*/
