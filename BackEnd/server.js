require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const { default: mqtt } = require('mqtt');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    // mqtt.server();
    console.log('Server listening on port ' + port);
});
