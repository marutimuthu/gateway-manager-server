const db = require("../models");
const Logs = db.logs;
const RSSI_logs = db.rssi_logs;

const paginatedResults = require("../middlewares/paginate")
// Create and Save a new device
exports.create = (req, res) => {

    // Validate request
    if (!req.body.mac_id) {
        res.status(400).send({ message: "mac_id can not be empty!" });
        return;
    }

    
    const logs = new Logs(req.body);

    // Save device in the database
    logs
        .save(logs)
        .then(data => {
            res
                .status(200)
                .send({ message: "Received"});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the log."
            });
        });
};

exports.findByMacid = async (req, res) => {

    const mac_id = req.params.mac_id;
    // const device_id = req.params.device_id;

    try {
        // console.log(mac_id)
        // console.log(device_id)
        const data = await Logs.where("mac_id")
            .equals(mac_id)
            .sort('-createdAt')

        if (!data)
            res.status(404).send({ message: "Invalid id: " + mac_id });
        else {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);

            // calculating the starting and ending index
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const results = {};

            if (endIndex < data.length) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }

            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                };
            }

            results.results = data.slice(startIndex, endIndex);

            res.send(results);
        }

        // console.log(data)
    } catch (err) {
        res
            .status(500)
            .send({ message: "Error retrieving data id: " + err.message });
    }
};

exports.findRSSIByMacid = async (req, res) => {

    const mac_id = req.params.mac_id;
    // const device_id = req.params.device_id;

    try {
        // console.log(mac_id)
        // console.log(device_id)
        const data = await RSSI_logs.where("mac_id")
            .equals(mac_id)
            .sort('-createdAt')

        if (!data)
            res.status(404).send({ message: "Invalid id: " + mac_id });
        else {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);

            // calculating the starting and ending index
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const results = {};

            if (endIndex < data.length) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }

            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                };
            }

            results.results = data.slice(startIndex, endIndex);

            res.send(results);
        }

        // console.log(data)
    } catch (err) {
        res
            .status(500)
            .send({ message: "Error retrieving data id: " + err.message });
    }
};