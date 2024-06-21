const config = require('config.json');
const mqtt = require('mqtt');

module.exports = {
    mqttConnect
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


function mqttConnect() {
    const client = mqtt.connect(connectUrl, options);
    client.on('connect', () => {
        console.log(`${config.protocol}: Connected`)
    })    
    return 'mqTTConnect';
}
