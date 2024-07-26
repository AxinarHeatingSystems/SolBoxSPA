const config = require('./../config.json');
const mqtt = require('mqtt');
const process = require('process');
const tmpDev = require('./../tmpDev.json');
const axios = require('axios');
const fs = require('fs');
const multiparty = require('multiparty');

const KcAdminClient = require('keycloak-admin').default;

module.exports = {
    mqttclients,
    mqttcreatedev,
    mqttupdatedev,
    mqttsharedev,
    mqttDevScheduleUpdate,
    mqttloadsharedUsers,
    mqttremoveshareduser,
    mqttDevicelist,
    mqttDeviceInfo,
    mqttdevFileupload,
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
            clientList = response.data;
            console.log('response');
        }).catch(err => {
            console.log(err)
            clientList = null;
            console.log('errored')
        });
    return clientList;
}

async function mqttremoveshareduser(devData){
    let resultData = {};
    console.log(devData);
    await kcAdminAuth();
    try {
        await kcAdminClient.users.delFromGroup({id: devData.userId, groupId: devData.devId, realm: config.keycloakRealm});
        const sharedlist = await kcAdminClient.groups.listMembers({id: devData.devId, realm: config.keycloakRealm});
        resultData = {state: 'success', data: sharedlist};
    } catch (error) {
        resultData = {state: 'failed', message: 'Removing shared user is failed'};  
    }

    return resultData
}

async function mqttloadsharedUsers(devData) {
    let resultData = {};
    await kcAdminAuth();
    console.log(devData);
    try {
        const shareduserlist = await kcAdminClient.groups.listMembers({id: devData.id, realm: config.keycloakRealm});
        resultData = {state: 'success', data: shareduserlist};
    } catch (error) {
        resultData = {state: 'failed', message: 'Shared users loading failed'};  
    }
    return resultData;
}

async function mqttsharedev(shareData) {
    let resultData = {};
    console.log(shareData);
    await kcAdminAuth();
    try {
        const addGoupeMembre =  await kcAdminClient.users.addToGroup({id: shareData.userId, groupId: shareData.devId, realm: config.keycloakRealm}); 
        const shareduserlist = await kcAdminClient.groups.listMembers({id: shareData.devId, realm: config.keycloakRealm});
        resultData = {state: 'success', data: shareduserlist};
    } catch (error) {
        resultData = {state: 'failed', message: 'Device Sharing is failed'};  
    }
    return resultData;
}

async function mqttupdatedev(devData) {
    let resultData = {};
    console.log(devData);
    await kcAdminAuth();
    try {
        const groupData = await kcAdminClient.groups.findOne({id: devData.devId, realm: config.keycloakRealm});
        let groupAttrs = {};
        
        const devInfoKeys = Object.keys(devData.devInfo);
        devInfoKeys.map(keyItem => {
            groupAttrs = {...groupAttrs, [keyItem]: [devData.devInfo[keyItem]]}
        });
        groupData.attributes = groupAttrs;
        const updatedGroup = await kcAdminClient.groups.update({id: devData.devId, realm: config.keycloakRealm}, groupData);
        console.log(updatedGroup);
        resultData = {state: 'success', data: groupData};
    } catch (error) {
        console.log('errorUpdateDev', error)
        resultData = {state: 'failed', message: 'New Device is failed'};
    }
    return resultData
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
            groupAttrs = {...groupAttrs, devOwner: [devData.userId]}
            groupAttrs = {...groupAttrs, devOwnerEmail: [devData.userEmail]}
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

async function mqttdevFileupload(imageData) {
    // console.log(req.files);
    var form = new multiparty.Form();
    let imgPath = '';
    form.parse(imageData, function(err, fields, files) {
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
            imgPath = `${rootPath}/images/images/${files.image[0].originalFilename}`;
            fs.writeFile(imgPath,e,(err)=>{
                console.log(err)
            });

        });    
    });
    return imgPath;
}

async function mqttDevScheduleUpdate(devInfo) {
    let resultData = {};
    await kcAdminAuth();
    console.log(devInfo);
    try {
        let existGroup = await kcAdminClient.groups.findOne({id: devInfo.devId, realm: config.keycloakRealm});    
        console.log(existGroup);
        if(existGroup){
            const existAttr = {...existGroup.attributes, ...devInfo.schedulePayLoad};
            console.log(existAttr);
            existGroup.attributes = existAttr;
            await kcAdminClient.groups.update({id: devInfo.devId, realm: config.keycloakRealm}, existGroup);
            resultData = {state: 'success', data: existGroup};
        }else{
            resultData = {state: 'failed', message: 'There is not the Device'};
        }
    } catch (error) {
        resultData = {state: 'failed', message: 'Device Schedule Updating is failed'};
    }
    
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

async function mqttDevicelist(userData) {
    let resultData = {};
    console.log(userData)
    await kcAdminAuth();
    try {
        const grouplist = await kcAdminClient.users.listGroups({id: userData.userId, realm: config.keycloakRealm});
        
        const emqxClients = await mqttclients();
        let ctGroupList = []
        for (let index = 0; index < grouplist.length; index++) {
            const groupItem = grouplist[index];
            const clientData = emqxClients.data.find(clientItem => clientItem.clientid == groupItem.name);
            if(clientData){
                groupItem.connected = clientData.connected;
            }else{
                groupItem.connected = false;
            }
            const groupData = await kcAdminClient.groups.findOne({id: groupItem.id, realm: config.keycloakRealm})
            groupItem.attributes = groupData.attributes;
            // console.log(groupItem.attributes);
            // return groupItem;
            ctGroupList.push(groupItem)
        }
        // const ctGroupList = grouplist.map(groupItem => {
        //     const clientData = emqxClients.data.find(clientItem => clientItem.clientid == groupItem.name);
        //     if(clientData){
        //         groupItem.connected = clientData.connected;
        //     }else{
        //         groupItem.connected = false;
        //     }
        //     return groupItem;
        // })
        resultData = {state: 'success', data: ctGroupList};
    } catch (error) {
        console.log(error);
        resultData = {state: 'failed', message: 'Device list loading is failed'};
    }

    return resultData;

}   

async function mqttDeviceInfo(devData){
    let resultData = {};
    console.log(devData);
    await kcAdminAuth();
    try {
        const devMeta = await kcAdminClient.groups.findOne({id: devData.id, realm: config.keycloakRealm});
        resultData = {state: 'success', data: devMeta};
    } catch (error) {
        resultData = {state: 'failed', message: 'Dev info is failed'};
    }
    return resultData
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