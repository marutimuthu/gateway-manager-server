module.exports = (app) => {
  const device = require("../controllers/device.controller.js");

  var router = require("express").Router();

  // Retrieve all gateways from user device array
  router.get("/:id", device.findByOIDarray);

  router.post("/", device.create);

  router.post("/ota", device.ota);

  // Retrieve all device
  router.get("/", device.findAll);

  // // Retrieve all published device
  // router.get("/published", device.findAllPublished);

  // // // Retrieve a single Device with id
  // router.get("/:id", device.findOne);

  // // Retrieve a single Device with id
  router.get("/find/:mac_id", device.findByMacid);

  // Update with id
  router.put("/:id", device.update);

  router.post("/:id", device.update);

  // Delete with id
  router.delete("/:id", device.delete);

  // Delete with id
  router.post("/config/update", device.mqttCommand);

  // router.delete("/", device.deleteAll);

  app.use("/api/device", router);
};
