const config = require('./../config.json');
const mqtt = require('mqtt');
const tmpDev = require('./../tmpDev.json');
const axios = require('axios');
const KcAdminClient = require('keycloak-admin').default;

module.exports = {
    mqttclients,
    mqttcreatedev,
    mqttDevicelist,
    mqttconnect,
    mqttmessage,
    mqttpublish
}

const kcAdminClient = new KcAdminClient( {
    baseUrl: config.keycloakPath,
    realmName: 'master',
  });

const clientId = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8)

const options = {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: config.user,
    password: config.password,
    reconnectPeriod: 1000,
    
    // for more options and details, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
  }

 const mqttPath = `${config.protocol}://${config.host}:${config.port}`
 
let lastMessage = tmpDev;

async function kcAdminAuth () {
    await kcAdminClient.auth({
        username: config.keycloakUser,
        password: config.keycloakPassword,
        grantType: 'password',
        clientId: config.keycloakClientId,
        // totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
      });
      
}

async function mqttclients() {
    console.log('mqttClients');
    const path = `${config.emqxhost}api/v5/clients`
    let clientList;
    await axios.get(path, {
        auth: {
          username: config.emqxuser,
          password: config.emqxpassword,
        },
        headers: {
          'Content-Type': 'application/json',
        },}).then((response) => {
            console.log(response.data);
            clientList = response.data;
            console.log('response');
        }).catch(err => {
            console.log(err)
            clientList = null;
            console.log('errored')
        });
    return clientList;
}

async function mqttconnect(input) {
    console.log(input);
    // const devId = input.devId;
    // // const devId = '08B61F971EAC';
    // const devTopic = `axinar/solbox/${devId}/jsonTelemetry`
    // console.log('devTopic', devTopic);
    // const clientsTopic = `$SYS/brokers`;
    // client.subscribe(devTopic, (err) => {
    //     if (!err) {
    //     //   client.publish("presence", "Hello mqtt");
    //         console.log('subscribed');
    //     }
    //   });
    return 'mqTTConnect';
}

async function mqttcreatedev(devData) {
    let resultData = {};
    console.log(devData);
    await kcAdminAuth();
    
    try {
        const existGroup = await kcAdminClient.groups.find({search: devData.pairingData.deviceId, realm: config.keycloakRealm});
        if(existGroup.length < 1){
            let groupAttrs = {};
            groupAttrs = {pairingCode: [devData.pairingData.pairingCode]};
            
            const devInfoKeys = Object.keys(devData.devInfo);
            devInfoKeys.map(keyItem => {
                groupAttrs = {...groupAttrs, [keyItem]: [devData.devInfo[keyItem]]}
            });
            
            const newGroupData = {
                name: devData.pairingData.deviceId,
                attributes: groupAttrs,
                realm: config.keycloakRealm
            };
            console.log(newGroupData)
            const createdGroup = await kcAdminClient.groups.create(newGroupData);
            console.log(createdGroup);
            const addGoupeMembre =  await kcAdminClient.users.addToGroup({id: devData.userId, groupId:createdGroup.id, realm: config.keycloakRealm});
            resultData = {state: 'success', data: createdGroup};
        }else{
            resultData = {state: 'failed', message: 'The device is already exist'};    
        }
        
    } catch (error) {
        // console.log(error);
        resultData = {state: 'failed', message: 'New Device is failed'};
    }

    return resultData;
}

async function mqttDevicelist(userData) {
    let resultData = {};
    console.log(userData)
    await kcAdminAuth();
    try {
        const grouplist = await kcAdminClient.users.listGroups({id: userData.userId, realm: config.keycloakRealm});
        const emqxClients = await mqttclients();
        const ctGroupList = grouplist.map(groupItem => {
            const clientData = emqxClients.find(clientItem => clientItem.clientid == groupItem.name);
            if(clientData){
                groupItem.connected = clientData.connected;
            }else{
                groupItem.connected = false;
            }
            return groupItem;
        })
        resultData = {state: 'success', data: ctGroupList};
    } catch (error) {
        resultData = {state: 'failed', message: 'Device list loading is failed'};
    }

    return resultData;

}   

async function mqttmessage(res) {
    console.log(lastMessage);
    if(lastMessage)
       return lastMessage
    else
        return null;
}

async function mqttpublish(res) {
    console.log(res);
    // const devTopic = `axinar/solbox/${res.DeviceID}/jsonTelemetry`
    // console.log(devTopic);
    // client.publish(devTopic, res, (error) => {
    //     if (error) {
    //       console.error('publish failed', error)
    //     }
    //   });
    return res;
}