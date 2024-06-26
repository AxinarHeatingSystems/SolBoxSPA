require('rootpath')();
const express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const { default: mqtt } = require('mqtt');
const socketio = require('socket.io');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/mqtt', require('./mqttServe/mqttServe.controller'));

// global error handler
app.use(errorHandler);

// start server

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    // mqtt.server();
    console.log('Server listening on port ' + port);
});

const io = socketio(server);
io.on('connect', (socket) => {
    socket.on('join', ({ devId }, callback) => {
      
      console.log('devID', devId);
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
  
      callback();
    });
  
    socket.on('sendMessage', (message, callback) => {
      // const user = getUser(socket.id);
  
      // io.to(user.room).emit('message', { user: user.name, text: message });
  
      callback();
    });
  
    socket.on('disconnect', () => {
      // const user = removeUser(socket.id);
  
      // if(user) {
      //   io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      //   io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      // }
    })
  });