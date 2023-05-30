const db = require("../models");
const Device = db.device;
const User = db.user;
const RSSI_logs = db.rssi_logs;

const client = require("../config/mqtt.config.js");
var ip = require("ip");
// console.dir(ip.address());

// Create and Save a new device
exports.create = (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({ message: "user_id can not be empty!" });
    return;
  }
 
  const device = new Device(req.body);

  // Save device in the database
  device
    .save(device)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the device.",
      });
    });
};

// Create and Save a new device
exports.ota = (req, res) => {
  // Validate request
  if (!req.body.mac_id) {
    res.status(400).send({ message: "mac_id can not be empty!" });
    return;
  }

  if (client.connected == true) {
    // console.log(req.body)
    var topic = req.body.mac_id + "/" + "cmd";
    // MT OTA URL
    // var msg = `{"OTA_URL":"${req.body.server_url}/api/file/download/${req.body.bin_file}"}`
    // setTimeout(() => {
    //     msg = `{"START_OTA"}`;
    //     client.publish(topic, msg);
    // }, 500);

    var msg = `{"action":"ota","url":"${req.body.server_url}/api/file/download/${req.body.bin_file}"}`;
    client.publish(topic, msg);
    res.status(200).send({ message: "OTA initiated" });
  } else {
    res.status(400).send({ message: "Broker not connected" });
  }
  // Save Log of OTA Update
  // const device = new Device(req.body);
  // device
  //     .save(device)
  //     .then(data => {
  //         res.send(data);
  //     })
  //     .catch(err => {
  //         res.status(500).send({
  //             message:
  //                 err.message || "Some error occurred while creating the device."
  //         });
  //     });
};

// Retrieve all devices from the database.
exports.findAll = (req, res) => {
  const device_name = req.query.device_name;
  var condition = device_name
    ? { device_name: { $regex: new RegExp(device_name), $options: "i" } }
    : {};

  Device.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving device.",
      });
    });
};

// Find a single User with an id
exports.findByMacid = async (req, res) => {
  const mac_id = req.params.mac_id;
  // const device_id = req.params.device_id;

  try {
    // console.log(mac_id)
    // console.log(device_id)
    const data = await Device.where("mac_id").equals(mac_id);

    if (!data) res.status(404).send({ message: "Invalid id: " + user_id });
    else res.send(data);

    // console.log(data)
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};

// Find a single Devoce with an id
exports.findDevice = async (req, res) => {
  const user_id = req.params.id;
  const device_id = req.params.device_id;

  try {
    // console.log(user_id)
    // console.log(device_id)

    // const data = await Device.where("user_id")
    //     .equals(user_id)

    const data = await Device.find({ zone: { details: { id: device_id } } });
    // .equals(device_id)

    if (!data) res.status(404).send({ message: "Invalid id: " + user_id });
    else res.send(data);

    // console.log(data)
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};

// Update a device by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  var data = { ...req.body, timestamp: Math.floor(Date.now()) };
  const logs = new RSSI_logs(data);

  logs
    .save(logs)
    .then((data) => {
      //    console.log(data)
      // res.send(data);
    })
    .catch((err) => {
      console.log({
        message: err.message || "Some error occurred while creating the log.",
      });
    });

  // console.log(req.body)

  Device.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        // console.error(req.body)
        res.status(404).send({
          message: `Cannot update device with id=${id}. Maybe device was not found!`,
        });
      } else {
        // console.log(req.body)
        // console.log("Updated " + data.updatedAt)
        // console.log("Updated " + data)
        res.send({ message: "Received", id: id });
      }
      // } else res.send({ message: "device was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating device with id=" + id,
      });
    });
};

// Delete a device with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Device.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete device with id=${id}. Maybe device was not found!`,
        });
      } else {
        res.send({
          message: "device was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete device with id=" + id,
      });
    });
};

// Find a single Devoce with an id
exports.findByOIDarray = async (req, res) => {
  const user_id = req.params.id;

  try {
    // console.log(user_id)

    const data = await User.findById(user_id);
    // .equals(device_id)

    // console.log(data.devices)

    if (!data) {
      res.status(404).send({ message: "Invalid id: " + user_id });
    } else {
      const devices = await Device.find({ _id: { $in: data.devices } });
      res.send(devices);
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};

// Find a single Devoce with an id
exports.mqttCommand = async (req, res) => {
  //   console.log(req.body)
  // Validate request
  if (!req.body.mac_id) {
    res.status(400).send({ message: "mac_id can not be empty!" });
    return;
  }
  let mqtt_check = 0;
  //   console.log(client.connected);
  
  if (client.connected) {
    var topic = req.body.mac_id + "/" + "cmd";
    client.publish(topic, JSON.stringify(req.body));
    res.status(200).send({ message: "Command Received" });
  } else {
    var mqttCheckConnection = setInterval(() => {
    //   console.log(mqtt_check);
    //   console.log(client.connected);
      mqtt_check++;

      if (client.connected) {
        clearInterval(mqttCheckConnection);
        var topic = req.body.mac_id + "/" + "cmd";
        client.publish(topic, JSON.stringify(req.body));
        res.status(200).send({ message: "Command Received" });
      }
      if (mqtt_check > 5) {
        clearInterval(mqttCheckConnection);
        res.status(400).send({ message: "Broker not connected" });
      }
    }, 500);
  }
};
