const express = require('express');
const router = express.Router();
const mqttServeService = require('./mqttServe.service');
const multiparty = require('multiparty');
const process = require('process');
const fs = require('fs');

router.post('/devConnect', mqttConnection)
router.get('/devMessage', mqttMessage)
router.post('/devControl', mqttPublish);
router.post('/getClients', mqttClients);
router.post('/createDev', mqttCreateDev);
router.post('/updateDev', mqttUpdateDev)
router.post('/shareDev', mqttShareDev);
router.post('/saveDevSchedule', mqttSaveDevSchedule)
router.post('/loadDevSharedUsers', mqttLoadDevSharedUser)
router.post('removeDevice', mqttDeleteDev);
router.post('/removeSharedUser', mqttRemoveSharedUser);
router.post('/userDevs', mqttUserDevs);
router.post('/getAllDevs', mqttAllDevs)
router.post('/getDevInfo', mqttDeviceInfo);
router.post('/uploadDevImage', mqttDevFileUpload);

module.exports = router;

function mqttClients(req, res, next) {
  mqttServeService.mqttclients(req.body).then(
    resData => resData? res.json(resData) : res.status(400).json({ message: 'connection is failed' })
  ).catch(err => next(err));
}

function mqttRemoveSharedUser(req, res, next){
  mqttServeService.mqttremoveshareduser(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData.data) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'New Device creating is failed' })
  ).catch(err => next(err));
}

function mqttLoadDevSharedUser(req, res, next) {
  mqttServeService.mqttloadsharedUsers(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData.data) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'Shared users loading is failed' })
  ).catch(err => next(err));
}

function mqttShareDev(req, res, next){
  mqttServeService.mqttsharedev(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData.data) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'Device sharing is failed' })
  ).catch(err => next(err));
}

function mqttUpdateDev(req, res, next) {
  mqttServeService.mqttupdatedev(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'New Device creating is failed' })
  ).catch(err => next(err));
}

function mqttCreateDev(req, res, next){
  mqttServeService.mqttcreatedev(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'New Device creating is failed' })
  ).catch(err => next(err));
}

function mqttDeleteDev(req, res, next) {
  mqttServeService.mqttDeleteDevice(req.body).then(
    resData => resData? 
    resData.state == 'success'? 
        res.json(resData) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'Device Delete is failed' })
).catch(err => next(err));
}

function mqttAllDevs(req, res, next){
  mqttServeService.mqttSavedDevList(req.body).then(
    resData => resData? 
        resData.state == 'success'? 
            res.json(resData) : res.status(400).json({ message: resData.message }) : res.status(400).json({ message: 'Device list loading is failed' })
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

function mqttSaveDevSchedule(req, res, next) {
  mqttServeService.mqttDevScheduleUpdate(req.body).then(
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

function mqttDevFileUpload(req, res, next){
  var form = new multiparty.Form();
    let imgPath = '';
    try {
      form.parse(req, function(err, fields, files) {
        // fields fields fields
        console.log(files.image);
        // console.log("Current directory:", __dirname, process.cwd());
        const rootPath = process.cwd();
        // const {error, e} = await fs.readFile(files.image[0].path);
        // if(error) return;
        // imgPath = `${rootPath}/images/${files.image[0].originalFilename}`;
        // await fs.writeFileSync(imgPath,e);
        fs.readFile(files.image[0].path,(err,e)=>{
            if(err) console.log(err);
            imgPath = `/images/${files.image[0].originalFilename}`;
            const wrPath = `${rootPath}/images/${files.image[0].originalFilename}`;
            fs.writeFile(wrPath,e,(err)=>{
                console.log(err)
                if(!err){
                  res.json(imgPath);
                }else{
                  res.status(400).json({ message: 'image upload is failed' })
                }
            });

        });    
    });
    } catch (error) {
      next(err)
    }
    
  // mqttServeService.mqttdevFileupload(req).then(
  //   resData => resData? res.json(resData) : res.status(400).json({ message: 'image upload is failed' })
  // ).catch(err => next(err));
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
