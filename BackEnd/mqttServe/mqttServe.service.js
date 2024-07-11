const config = require('./../config.json');
const mqtt = require('mqtt');
const tmpDev = require('./../tmpDev.json');
const axios = require('axios');

module.exports = {
    mqttclients,
    mqttconnect,
    mqttmessage,
    mqttpublish
}
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

async function mqttclients(body) {
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