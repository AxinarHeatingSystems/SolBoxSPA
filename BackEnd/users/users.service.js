const config = require('config.json');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
// const db = require('_helpers/db');
const KcAdminClient = require('keycloak-admin').default;

const kcAdminClient = new KcAdminClient( {
      baseUrl: config.keycloakPath,
      realmName: 'master',
    });
 kcAdminClient.auth({
    username: config.keycloakUser,
    password: config.keycloakPassword,
    grantType: 'password',
    clientId: 'admin-cli',
    totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
  });


module.exports = {
    authenticate,
    create,
    emailResetPassword,
    resetPassword
}

async function authenticate({email, password}) {
    console.log(email, password);
    
    // const users = await kcAdminClient.users.find({ email: "stelianrosca618@outlook.com" });
    const users = await kcAdminClient.users.findOne({  email: email });
    if(users.length > 0){
        console.log(users);
        return users;    
    }else{
        console.log('empty');
        return null;
    }
    // console.log(users[0].id);
    
}

async function create(userParam) {
    console.log(userParam);
    const createduser = await kcAdminClient.users.create({
        username: userParam.username,
        email: userParam.email,
        firstName: userParam.firstName,
        lastName: userParam.lastName,
        // enabled required to be true in order to send actions email
        emailVerified: false,
        enabled: true,
        credentials: [{type: 'password', value: userParam.password}],
      })
    console.log(createduser);
    return userParam;
}

async function emailResetPassword({email}) {
    console.log(email);
    return {email};
}

async function resetPassword({email, oldPassword, newPassword}) {
    console.log({email, oldPassword, newPassword});
    return {email, oldPassword, newPassword}
}