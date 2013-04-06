var io = require('socket.io').listen(8001);
var redis = require("redis");

io.of('/notifications').
on('connection', function (socket) {

    console.log("New connection: " + socket.id);
    // Send the message of connection for receiving the user ID
    socket.emit('connected');

    // Receive the ID
    socket.on('join', function(userId){
      var channel = "push:notifications:" + userId;
      console.log("Connecting to redis: " + channel);

      // store in the socket our connection
      socket.redisClient =  redis.createClient();
      socket.redisClient.subscribe(channel);

      // subscribe to our channel (We don't need to check because we have a
      // connection per channel/user)
      socket.redisClient.on("message", function(channel, message) {
        console.log(channel + ': ' + message);
        socket.emit('notification', channel, message);
      });

    });

});
