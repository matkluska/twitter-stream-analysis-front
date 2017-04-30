var config = require('config');

var express = require('express');
var app = express();
var http = require('http').Server(app);

var redis = require('redis');
var url = config.get('redis.url');
// var client = redis.createClient(url);
// var client2 = redis.createClient(url);

var io = require('socket.io');

app.use('/', express.static('www'));

http.listen(8000, function () {
    console.log('listening on *:8000');
});

var socket = io.listen(http);

socket.on('connection', function (client) {
    const subscribe = redis.createClient(url);
    subscribe.subscribe('TweetStream');

    subscribe.on("message", function (channel, msg) {
        console.log(msg);
        client.send(msg);
    });

    client.on('message', function (msg) {
        console.log(msg);
        client.send(msg);
    });

    subscribe.on('disconnect', function () {
        subscribe.quit();
    })
});

// client.on('message', function(chan, msg) {
//     console.log(chan);
//     console.log(msg);
//
// client2.hgetall(msg, function(err, res) {
//   res.key = msg;
//   io.sockets.emit('twits', res);
// });
// });
//
// client1.subscribe('TweetStream');
