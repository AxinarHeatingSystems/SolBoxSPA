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
const { WebSocketServer } = require('ws');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const corsOpts = {
//     methods: [
//         'POST',
//         'GET',
//         'DELETE',
//         'PUT',
//         'PATCH',
//         'HEAD',
//         'OPTIONS'
//     ],
//     origin: [
//         'http://localhost:3000',
//         'http://localhost:3001',
//         'http://localhost:8081',
//         'http://18.218.170.205',
//         'http://127.0.0.1:5173',
//         'http://localhost:5173',
//     ],
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true 
//   };
  
// app.use(cors(corsOpts));
app.use(cors());
// use JWT auth to secure the api
app.use(jwt());

// app.use(function (req, res, next) {
//     // Publish messages
//     req.mqttPublish = function (topic, message) {
//       mqttClient.publish(topic, message)
//     }
  
//     // Subscribe to topic
//     req.mqttSubscribe = function (topic, callback) {
//       mqttClient.subscribe(topic)
//       mqttClient.on('message', function (t, m) {
//         if (t === topic) {
//           callback(m.toString())
//         }
//       })
//     }
//     next()
//   })
// api routes
// app.use('/users', require('./users/users.controller'));
// app.use('/taskval', require('./Taskvals/taskVal.controller'));
// app.use('/tasknote', require('./TaskNotes/taskNote.controller'));
app.use('/mqtt', require('./mqttServe/mqttServe.controller'));

// global error handler
app.use(errorHandler);

// start server

// const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
// const server = app.listen(port, function () {
//     // mqtt.server();
//     console.log('Server listening on port ' + port);
// });
const options = {
    key: fs.readFileSync('./certificate/privkey1.pem'),
    cert: fs.readFileSync('./certificate/cert1.pem')
  };

// http.createServer(app).listen(4000);
https.createServer(options, app).listen(4000);