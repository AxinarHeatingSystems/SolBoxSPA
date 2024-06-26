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
const config = require('config.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/mqtt', require('./mqttServe/mqttServe.controller'));

// global error handler
app.use(errorHandler);

const clientId = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8)
const options = {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: config.user,
  password: config.password,
  reconnectPeriod: 1000,
  
  // for more options and details, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
}
const mqttPath = `${config.protocol}://${config.host}:${config.port}`
const client = mqtt.connect(mqttPath, options);

client.on('connect', () => {
  console.log(`${config.protocol}: Connected`)
})
client.on('reconnect', (error) => {
  console.log(`Reconnecting(${config.protocol}):`, error)
})
// start server
const httServer = http.createServer(app);
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

const io = socketio(httServer);
io.on('connect', (socket) => {
    socket.on('join', ({ devId }, callback) => {
      
      console.log('devID', devId);
      // socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      const devTopic = `axinar/solbox/${devId}/jsonTelemetry`
      console.log('devTopic', devTopic);
      const clientsTopic = `$SYS/brokers`;
      client.subscribe(devTopic, (err) => {
        if (!err) {
          socket.emit('DevSubscribed', 'Device connected')
        }
      });
  
      callback();
    });

    client.on('message', (topic, payload) => {
      console.log('Received Message:', topic, payload.toString())
      const lastMessage = payload.toString();
      socket.emit('message', lastMessage);
    })
    
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

  const server = httServer.listen(port, function () {
    // mqtt.server();
    console.log('Server listening on port ' + port);
});
