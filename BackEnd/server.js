const express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwtAuth = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const { default: mqtt } = require('mqtt');
const socketio = require('socket.io');
const config = require('./config.json');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/images')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// use JWT auth to secure the api
app.use(jwtAuth());
const httServer = http.createServer(app);

const io = socketio(httServer, {cors: {
  origin: "*",
  methods: ["GET", "POST"]
}});

// api routes
app.use('/mqtt', require('./mqttServe/mqttServe.controller'));
app.use('/user', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

const clientId = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8)
const options = {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'nodeJoin',
  password: config.password,
  reconnectPeriod: 1000,
  
  // for more options and details, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
}
const mqttPath = `${config.protocol}://${config.host}:${config.port}`
const client = mqtt.connect(mqttPath, options);


client.on('reconnect', (error) => {
  console.log(`Reconnecting(${config.protocol}):`, error)
})
// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

io.on('connect', (socket) => {
  client.on('connect', () => {
    console.log(`${config.protocol}: Connected`);

    socket.on('join', ({ devId }, callback) => {
      
      console.log('devID', devId);
      // socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      const devTopic = `axinar/solbox/${devId}/jsonTelemetry`
      console.log('devTopic', devTopic);
      client.subscribe(devTopic, (err) => {
        if (!err) {
          socket.emit('DevSubscribed', 'Device connected')
        }else{
          callback(err);
          socket.emit('devdiscon', 'devDiscon');
          console.log('eeee', err);
        }
      });
      const controlTopic = `axinar/solbox/${devId}/mainControlJson`
      client.subscribe(controlTopic, (err) => {
        if(!err) {
          socket.emit('DevControlSubscribed', 'Device connected')
        }else{
          callback(err);
          socket.emit('devCondiscon', 'devCondiscon');
          console.log('eeeeCon', err);
        }
      })
  
      callback();
    });

    socket.on('leave', ({devId}, callback) => {
      const devTopic = `axinar/solbox/${devId}/jsonTelemetry`
      client.unsubscribe(devTopic, (err) => {
        if (!err) {
          socket.emit('DevUnSubscribed', 'Device disconnected')
        }
      });
  
      callback();
    })

    client.on('message', (topic, payload) => {
      
      const lastMessage = payload.toString();
      socket.emit(topic, lastMessage);
      // socket.emit(`devname/${topic}`, lastMessage);
      socket.emit('message', lastMessage);
    })

    socket.on('devUpdate', ({devInfo}, callback) => {
      console.log(devInfo)
      const payload = devInfo.payload;

      const devTopic = `axinar/solbox/${devInfo.DeviceID}/mainControlJson`
      client.publish(devTopic, JSON.stringify(payload), (error) => {
        if (error) {
          console.error('publish failed', error)
          socket.emit('devControl', error);
        }
      });
      callback();
    });
  
    socket.on('disconnect', () => {
      // const user = removeUser(socket.id);
  
      // if(user) {
      //   io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      //   io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      // }
    })
  })
    
  });

  const server = httServer.listen(port, function () {
    // mqtt.server();
    console.log('Server listening on port ' + port);
});
