var mqtt = require('mqtt');
require('dotenv').config()
const db = require("../models");
const Logs = db.logs; 
const max_restart = 5
var check_restart = 0

// Broker config
const options = {
    clientId: "data_db", 
    clean: true,
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD
};

// Connect to broker
var client = mqtt.connect(process.env.BROKER_URL, options)
client.on("connect", function () {
    // console.log(`🚀 MQTT Broker Connected: [ ${process.env.BROKER_URL} ]`);
})

client.on("error", function (error) {
    console.error(error)
    if(!client.connected){
        setTimeout(() => {
            client.end();
            check_restart++
            console.log("Broker connection failed - Reattempting" + error);
            client = mqtt.connect(process.env.BROKER_URL, options);
            if (check_restart > max_restart) {
                console.log("Broker connection failed - Process Exit" + error);
                process.exit(1)
            }
        }, 500);
    }
});

// Subscribe
var topic_list = ["system/logs"];
client.subscribe(topic_list, { qos: 1 });

// Listener
client.on('message', function (topic, message, packet) {
    console.log("-[ message received: " + message + " at topic " + topic);
    // console.log(message)  
    let rec_message = JSON.parse(message);
    const logs = new Logs(rec_message);

    // Save device in the database
    logs
        .save(logs)
        .then(data => {
            // console.log(data)
            // res.send(data);
        })
        .catch(err => {
            console.log(err)
            // res.status(500).send({
            //     message:
            //         err.message || "Some error occurred while creating the log."
            // });
        });
});

module.exports = client;