const express = require('express');
const router = express.Router();
const mqttServeService = require('./mqttServe.service');

router.get('/devConnect', mqttConnection)
module.exports = router;

function mqttConnection(req, res, next) {
  console.log(mqttServeService)
  mqttServeService.mqttconnect(req.body).then(
    resData => resData? res.json(resData) : res.status(400).json({ message: 'Username or password is incorrect' })
  ).catch(err => next(err));
}