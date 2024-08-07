const expressJwt = require('express-jwt');
const config = require('./../config.json');
const jwt = require('jsonwebtoken')
// const userService = require('../users/user.service');

module.exports = jwtAuth;

function jwtAuth() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/images/*',
            '/user/googleauth',
            '/user/googleregister',
            '/user/resetPassword',
            '/user/resetpasswordemail',
            '/user/register',
            '/user/authenticate',
            '/user/technicianverfity',
            '/mqtt/devConnect',
            '/mqtt/devMessage',
            '/mqtt/devControl'
        ]
    });
}

async function isRevoked(req, payload, done) {
    // const user = await userService.getById(payload.sub);
    // if(!jwt.verify(payload.header, config.secret)){
    //     return done(null, true);
    // }
    // revoke token if user no longer exists
    // if (!user) {
    //     return done(null, true);
    // }
    
    done();
};