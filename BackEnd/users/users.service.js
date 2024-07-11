const config = require('./../config.json');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { RequiredActionAlias } = require('keycloak-admin/lib/defs/requiredActionProviderRepresentation');
// const db = require('_helpers/db');
const KcAdminClient = require('keycloak-admin').default;

const kcAdminClient = new KcAdminClient( {
      baseUrl: config.keycloakPath,
      realmName: 'master',
    });
// const kcAdminClient = new KcAdminClient( {
//     baseUrl: 'http://localhost:8080/',
//     realmName: 'master',
//   });
kcAdminAuth();

async function kcAdminAuth () {
    await kcAdminClient.auth({
        username: config.keycloakUser,
        password: config.keycloakPassword,
        grantType: 'password',
        clientId: config.keycloakClientId,
        // totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
      });
      
}
 
// kcAdminClient.auth({
//     username: 'admin',
//     password: 'admin',
//     grantType: 'password',
//     clientId: 'security-admin-console',
//     totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
//   });


module.exports = {
    googleAuth,
    googleSignUp,
    authenticate,
    create,
    emailResetPassword,
    resetPassword,
    existLogin,
    technicianVerfity
}

async function googleAuth(authload) {
    console.log(authload)
    let resultData = {};
    await kcAdminAuth();
    try {
        const users = await kcAdminClient.users.findOne({email: authload.email, realm: config.keycloakRealm});
        if(users.length > 0){
            const loggedUser = users[0];
            if(loggedUser.emailVerified){
                if(loggedUser.attributes.googleId){
                    const userHash = loggedUser.attributes.googleId[0];
                }else{
                    loggedUser.attributes.googleId[0] = authload.googleId;
                    await kcAdminClient.users.update({id: loggedUser.id, realm: config.keycloakRealm}, loggedUser);
                }
                const token = jwt.sign({ sub: loggedUser.id }, config.secret, { expiresIn: '7d' });
                resultData = {state: 'success', data: loggedUser, token: token};;
            }else{
                resultData = {state: 'failed', message: 'Please verify your email'};
            }
            
        }else{
            resultData = {state: 'failed', message: 'User is not exist'};
            // const newUser = await kcAdminClient.users.create({
            //     username: authload.name,
            //     email: authload.email,
            //     firstName: authload.givenName,
            //     lastName: authload.familyName,
            //     // enabled required to be true in order to send actions email
            //     emailVerified: true,
            //     enabled: true,
            //     attributes: {
            //         'googleId': [authload.googleId],
            //     },
            //     realm: config.keycloakRealm
            //   });
            //   console.log(newUser, newUser.id);
            //   try {
            //     await kcAdminClient.users.sendVerifyEmail({id: newUser.id, clientId: config.keycloakClientId2, 
            //         redirectUri: 'https://solbox-clients.axinars.uk/login', realm: config.keycloakRealm});    
            //   } catch (error) {
            //     console.log(error);
            //   }
            // //   const loggedUser = await kcAdminClient.users.findOne({id: newUser.id, realm: config.keycloakRealm})
            // //   const token = jwt.sign({ sub: newUser.id }, config.secret, { expiresIn: '7d' });
            // //   resultData = {state: 'success', data: authload, token: token};;
            // resultData = {state: 'success', data: newUser};
        }
    } catch (error) {
        console.log(error);
        resultData = {state: 'failed', message: 'Google login is failed'};
    }
    return resultData;

}

async function googleSignUp(authload){
    console.log('googleSign');
    console.log(authload);
    let resultData = {};
    await kcAdminAuth();
    try {
        const users = await kcAdminClient.users.findOne({email: authload.email, realm: config.keycloakRealm});
        if(users.length < 1){
            const newUser = await kcAdminClient.users.create({
                username: authload.name,
                email: authload.email,
                firstName: authload.givenName,
                lastName: authload.familyName,
                // enabled required to be true in order to send actions email
                emailVerified: false,
                enabled: true,
                attributes: {
                    'googleId': [authload.googleId],
                    'userType': [authload.usertype],
                },
                realm: config.keycloakRealm
              });
              console.log(newUser, newUser.id);
            await kcAdminClient.users.executeActionsEmail({
                id: newUser.id,
                clientId: config.keycloakClientId2,
                lifespan: 60,
                redirectUri: 'https://solbox-clients.axinars.uk/login',
                actions: [RequiredActionAlias.VERIFY_EMAIL], 
                realm: config.keycloakRealm
            })   
           resultData = {state: 'success', data: newUser};
        } else{
            resultData = {state: 'failed', message: 'User is exist'};
        }
    } catch (error) {
        console.log(error);
        resultData = {state: 'failed', message: 'Google signup is failed'};
    }

    return resultData;
}

async function authenticate({email, password}) {
    console.log(email, password);
    let resultData = {};
    await kcAdminAuth();
    const allUsers = await kcAdminClient.users.find();
    console.log(allUsers);
    try {
        const users = await kcAdminClient.users.findOne({  email: email, credentials: [{type: 'password', value: password}], realm: config.keycloakRealm });
        console.log(users);
        if(users.length > 0){
            // console.log(users);
            const loggedUser = users[0];
            const userHash = loggedUser.attributes.pass;
            console.log(userHash, bcrypt.compareSync(password, userHash[0]));
            if(bcrypt.compareSync(password, userHash[0])){
                const token = jwt.sign({ sub: loggedUser.id }, config.secret, { expiresIn: '7d' });
                resultData = {state: 'success', data: loggedUser, token: token};;
            }else{
                resultData = {state: 'failed', message: 'Email or Password is not matched!'};
            }
        }else{
            resultData = {state: 'failed', message: 'The user is not exist'};
        }
    } catch (error) {
        console.log(error);
        resultData = {state: 'failed', message: 'Email or Password is not matched'};
    }
    
    // console.log(users[0].id);
    console.log(resultData);
    return resultData;
}   

async function technicianVerfity(userId) {
    console.log(userId);
    return 'Usered'
}

async function create(userParam) {
    await kcAdminAuth();
    let resultData = {};
    console.log(userParam);
    try {
        const existUser = await kcAdminClient.users.find({
            email: userParam.email,
            username: userParam.username,
            realm: config.keycloakRealm
        });
        console.log(existUser);
        if(existUser.length < 1){
            const createduserId = await kcAdminClient.users.create({
                username: userParam.username,
                email: userParam.email,
                firstName: userParam.firstname,
                lastName: userParam.lastname,
                // enabled required to be true in order to send actions email
                emailVerified: false,
                enabled: true,
                attributes: {
                    'pass': [bcrypt.hashSync(userParam.password, 10)],
                    'userType': [userParam.usertype],
                },
                credentials: [{type: 'password', value: userParam.password}],
                realm: config.keycloakRealm
              })
              console.log(createduserId);
            //   try {
                // await kcAdminClient.users.sendVerifyEmail({id: createduserId.id, clientId: config.keycloakClientId2, 
                //     redirectUri: 'https://solbox-clients.axinars.uk/login', realm: config.keycloakRealm});   
                if(userParam.usertype === 'user') {
                    await kcAdminClient.users.executeActionsEmail({
                        id: createduserId.id,
                        clientId: config.keycloakClientId2,
                        lifespan: 60,
                        redirectUri: 'https://solbox-clients.axinars.uk/login',
                        actions: [RequiredActionAlias.VERIFY_EMAIL], 
                        realm: config.keycloakRealm
                    })   
                }else{
                    await kcAdminClient.users.executeActionsEmail({
                        id: createduserId.id,
                        clientId: config.keycloakClientId2,
                        lifespan: 60,
                        redirectUri: `https://solbox-back.axinars.uk/user/technicianVerfity?userId=${createduserId.id}`,
                        actions: [], 
                        realm: config.keycloakRealm
                    })   
                }
                
            //   } catch (error) {
            //     console.log(error);
            //   }
           resultData = {state: 'success', data: createduserId};
        }else{
            resultData = {state: 'failed', message: 'User is exist'};
        }
    } catch (error) {
        console.log(error);
        resultData = {state: 'failed', message: 'Api working is broken'};
    }
    
    
    return resultData;
}

async function emailResetPassword({email}) {
    let resultData = {};
    await kcAdminAuth();
    console.log(email);
    const user = await kcAdminClient.users.findOne({email: email, realm: config.keycloakRealm});
    if(user.length > 0){
        const selectedUser = user[0];
        
        try {
            await kcAdminClient.users.executeActionsEmail({
                id: selectedUser.id,
                clientId: config.keycloakClientId2,
                lifespan: 60,
                redirectUri: 'https://solbox-clients.axinars.uk/resetpassword',
                actions: [], 
                realm: config.keycloakRealm
            })    
            resultData = {state: 'success', message: 'The Reset Password Email was sent. Please check your email'};
        } catch (error) {
            resultData = {state: 'failed', message: 'The Reset Password Email is failed'};
            console.log(error);
        }
        console.log(selectedUser);
    }else{
        resultData = {state: 'failed', message: 'User is not exist'};
    }
    return resultData;
}

async function resetPassword({email, newPassword}) {
    let resultData = {};
    await kcAdminAuth();
    console.log('ppp');
    console.log({email, newPassword});
    try {
        const user = await kcAdminClient.users.findOne({email: email, realm: config.keycloakRealm});    
        if(user.length > 0) {
            const selectedUser = user[0];
            await kcAdminClient.users.update({id: selectedUser.id, realm: config.keycloakRealm}, {
                username: selectedUser.username,
                email: selectedUser.email,
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                // enabled required to be true in order to send actions email
                emailVerified: selectedUser.emailVerified,
                enabled: true,
                attributes: {
                    'pass': [bcrypt.hashSync(newPassword, 10)],
                },
                credentials: [{type: 'password', value: newPassword}],
            })
            resultData = {state: 'success', message: 'Password is updated'};
        }else{
            resultData = {state: 'failed', message: 'User is not exist'};            
        }
    } catch (error) {
        console.log(error);
        resultData = {state: 'failed', message: 'User is not exist'};
    }
    
    return resultData;
}

async function existLogin(userdata) {
    let resultData = {};
    await kcAdminAuth();
    try {
        console.log(userdata);
        const user = await kcAdminClient.users.findOne({email: userdata.useremail, realm: config.keycloakRealm});
        resultData = {state: 'success', data: user[0]};    
    } catch (error) {
        console.log(error);
        resultData = {state: 'failed', message: 'User is not exist'};
    }
    
    return resultData;
}
