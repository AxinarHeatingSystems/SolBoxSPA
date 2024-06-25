const config = require('config.json');
const mqtt = require('mqtt');
const tmpDev = require('tmpDev.json');

module.exports = {
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
const client = mqtt.connect(mqttPath, options);

let lastMessage = tmpDev;

client.on('connect', () => {
    console.log(`${config.protocol}: Connected`)
})
client.on('reconnect', (error) => {
  console.log(`Reconnecting(${config.protocol}):`, error)
})

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
    lastMessage = payload.toString();
})
  
async function mqttconnect(input) {
    const devId = '08B61F971EAC';
    const devTopic = `axinar/solbox/${devId}/jsonTelemetry`
    const clientsTopic = `$SYS/brokers`;
    client.subscribe(devTopic, (err) => {
        if (!err) {
        //   client.publish("presence", "Hello mqtt");
            console.log('subscribed');
        }
      });
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
    const devTopic = `axinar/solbox/${res.DeviceID}/jsonTelemetry`
    console.log(devTopic);
    client.publish(devTopic, res, (error) => {
        if (error) {
          console.error('publish failed', error)
        }
      });
    return res;
}