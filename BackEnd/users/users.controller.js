const express = require('express');
const router = express.Router();
const userService = require('./users.service');
const config = require('../config.json');

router.post('/googleauth', googleauth);
router.post('/googleregister', googleRegister);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/resetpasswordemail', resetPasswordEmail);
router.post('/resetpassword', resetPassword);
router.post('/existLogin', existLogin);
router.post('/getAllUsers', getAllUsers);
router.get('/technicianverfity', technicianVerfity)

module.exports = router;

function getAllUsers(req, res, next) {
    userService.getAllUsers()
        .then((data) => data? data.state == 'success'? res.json({data}) : res.status(400).json({ message: data.message }) : res.state(400).json({message: 'Reset Password Emailing is faild'}))
        .catch(err => next(err));
}

function googleauth (req, res, next) {
    userService.googleAuth(req.body)
        .then(user => user? 
            user.state == 'success'? 
            res.json(user) : res.status(400).json({ message: user.message }) : res.status(400).json({ message: 'Google Auth is failed' })
        )
        .catch(err => next(err));
}

function googleRegister (req, res, next) {
    userService.googleSignUp(req.body)
    .then(user => user? 
        user.state == 'success'? 
        res.json(user) : res.status(400).json({ message: user.message }) : res.status(400).json({ message: 'Google Auth is failed' })
    )
    .catch(err => next(err));
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user? 
            user.state == 'success'? 
            res.json(user) : res.status(400).json({ message: user.message }) : res.status(400).json({ message: 'Username or password is incorrect' })
        )
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then((user) => user? 
            user.state == 'success'? 
            res.json(user) : res.status(400).json({ message: user.message }) : res.status(400).json({ message: 'Registeration is failed' })
        )
        .catch(err => next(err));
}

function resetPasswordEmail(req, res, next){
    userService.emailResetPassword(req.body)
        .then((data) => data? data.state == 'success'? res.json({data}) : res.status(400).json({ message: data.message }) : res.state(400).json({message: 'Reset Password Emailing is faild'}))
        .catch(err => next(err));
}

function resetPassword(req, res, next){
    userService.resetPassword(req.body)
        .then((data) => data? data.state == 'success'? res.json(data) : res.status(400).json({ message: data.message }) : res.state(400).json({message: 'Reset Password is faild'}))
        .catch(err => next(err))
}

function technicianVerfity(req, res, next){
    userService.technicianVerfity(req.query)
        .then((data) => res.redirect(`${config['solbox-frontend']}/login`))
        .catch(err => next(err))
}

function existLogin(req, res, next){
    userService.existLogin(req.body)
        .then((data) => data? data.state == 'success'? res.json(data) : res.status(400).json({ message: data.message }) : res.state(400).json({message: 'User not exist'}))
        .catch(err => next(err));
}