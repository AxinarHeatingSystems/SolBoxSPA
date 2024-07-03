const config = require('config.json');
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
 kcAdminClient.auth({
    username: config.keycloakUser,
    password: config.keycloakPassword,
    grantType: 'password',
    clientId: config.keycloakClientId,
    totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
  });

// kcAdminClient.auth({
//     username: 'admin',
//     password: 'admin',
//     grantType: 'password',
//     clientId: 'security-admin-console',
//     totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
//   });


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
        const loggedUser = users[0];
        const userHash = loggedUser.attributes.pass;
        console.log(userHash, bcrypt.compareSync(password, userHash[0]));
        if(bcrypt.compareSync(password, userHash[0])){
            const token = jwt.sign({ sub: loggedUser.id }, config.secret, { expiresIn: '7d' });
            return {state: 'success', data: loggedUser, token: token};
        }else{
            return {state: 'failed', message: 'Email or Password is not matched'};
        }
    }else{
        console.log('empty');
        return {state: 'failed', message: 'The user is not exist'};
    }
    // console.log(users[0].id);
    
}

async function create(userParam) {
    console.log(userParam);
    const existUser = await kcAdminClient.users.find({
        email: userParam.email,
        username: userParam.username
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
                'phone': [userParam.phone],
            },
            credentials: [{type: 'password', value: userParam.password}],
          })
          console.log(createduserId);
          try {
            await kcAdminClient.users.sendVerifyEmail({id: createduserId.id, clientId: config.keycloakClientId});    
          } catch (error) {
            console.log(error);
          }
        
        
        return {state: 'success', data: createduserId};
    }else{
        console.log('existUser');
        return {state: 'failed', message: 'User is exist'};
    }
    
    return userParam;
}

async function emailResetPassword({email}) {
    console.log(email);
    const user = await kcAdminClient.users.findOne({email: email});
    if(user.length > 0){
        const selectedUser = user[0];
        
        try {
            await kcAdminClient.users.executeActionsEmail({
                id: selectedUser.id,
                clientId: config.keycloakClientId,
                lifespan: 60,
                actions: [RequiredActionAlias.UPDATE_PASSWORD]
            })    
        } catch (error) {
            console.log(error);
        }
        console.log(selectedUser);
    }
    return {email};
}

async function resetPassword({email, oldPassword, newPassword}) {
    console.log({email, oldPassword, newPassword});
    return {email, oldPassword, newPassword}
}