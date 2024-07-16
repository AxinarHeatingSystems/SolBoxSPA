const express = require('express');
const router = express.Router();
const mqttServeService = require('./mqttServe.service');

router.post('/devConnect', mqttConnection)
router.get('/devMessage', mqttMessage)
router.post('/devControl', mqttPublish);
router.post('/getClients', mqttClients);
router.post('/createDev', mqttCreateDev);
router.post('/userDevs', mqttUserDevs);
router.post('/getDevInfo', mqttDeviceInfo);

module.exports = router;

function mqttClients(req, res, next) {
  mqttServeService.mqttclients(req.body).then(
    resData => resData? res.json(resData) : res.status(400).json({ message: 'connection is failed' })
  ).catch(err => next(err));
}

function mqttCreateDev(req, res, next){
  mqttServeService.mqttcreatedev(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'New Device creating is failed' })
  ).catch(err => next(err));
}

function mqttUserDevs(req, res, next){
  mqttServeService.mqttDevicelist(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'Device list loading is failed' })
  ).catch(err => next(err));
}

function mqttDeviceInfo(req, res, next){
  mqttServeService.mqttDeviceInfo(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'Device info is failed' })
  ).catch(err => next(err));
}

function mqttConnection(req, res, next) {
  console.log(req.body);
  mqttServeService.mqttconnect(req.body).then(
    resData => resData? res.json(resData) : res.status(400).json({ message: 'connection is failed' })
  ).catch(err => next(err));
}

function mqttMessage(req, res, next) {
  mqttServeService.mqttmessage(req.body).then(
    resData => resData? res.json(resData) : res.status(400).json({ message: 'Device Info is wrong' })
  ).catch(err => next(err));
}

function mqttPublish(req, res, next) {
  mqttServeService.mqttpublish(req.body).then(
    resData => resData? res.json(resData) : res.status(400).json({ message: 'Device Info is wrong' })
  )
}
