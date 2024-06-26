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

const httServer = http.createServer(app);

const io = socketio(httServer, { 
  origins: ['*'],
  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"GET,POST",
    "Access-Control-Allow-Credentials":true,
    });
    res.end()
    }
});

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
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

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

    socket.on('devUpdate', (message, callback) => {
      const payload = JSON.parse(message);
      const devTopic = `axinar/solbox/${payload.DeviceID}/jsonTelemetry`
      client.publish(devTopic, payload, (error) => {
        if (error) {
          console.error('publish failed', error)
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
  });

  const server = httServer.listen(port, function () {
    // mqtt.server();
    console.log('Server listening on port ' + port);
});
