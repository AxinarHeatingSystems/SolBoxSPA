const express = require('express');
const router = express.Router();
const mqTTService = require('./mqttServe.service');

router.post('/devConnect', mqttConnection)
module.exports = router;

function mqttConnection(req, res, next) {
  mqTTService.mqttConnect().then(
    resData => resData? res.json(resData) : res.status(400).json({ message: 'Username or password is incorrect' })
  ).catch(err => next(err));
}