const db = require("../models");
const Data = db.data;

Data.createCollection({
    timeseries: {
        timeField: "timestamp",
        metaField: "metadata",
        granularity: "seconds"
    },
    expireAfterSeconds: 2592000 // 30 days 
});


// Get Data of Month
exports.month = async (req, res) => {

    // const result = await Data.find().limit(112).sort({$natural:-1})

    // const result = Data.find({
    //     $where: function() { 
    //       let currentDate = new Date(); 
    //       let lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1)); 

    //       return this.createdOn.getFullYear() === lastMonthDate.getFullYear() 
    //         && this.createdOn.getMonth() === lastMonthDate.getMonth(); 
    //     }
    //   })

    const result = await Data.find({
        timestamp: {
            $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000)
        }
    });

    if (result) {
        // console.log(result)
        res.send(result)
    }
}

//Get Data of Last Week
exports.week = async (req, res) => {
    const result = await Data.find({
        timestamp: {
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
        }
    });

    if (result) {
        // console.log(result)
        res.send(result)
    }
    // console.log(error)
}
// Create and Save a new data
exports.create = (req, res) => {
    // Validate request
    if (!req.body.mac_id) {
        res.status(400).send({ message: "mac_id can not be empty!" });
        return;
    }

    const data = new Data(req.body);

    // Save data in the database
    data
        .save(data)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the data."
            });
        });
};

exports.displayData = async (req, res) => {
    const datas = await Data.find({})

    res.send(datas)
}

// Retrieve all datas from the database.
exports.find = (req, res) => {
    const id = req.params.id;
    const from = req.params.from;
    const to = req.params.to;
    // console.log({ from })
    Data.find({
        // deviceId: id,
        timestamp: {
            $gte: from,
            $lt: to // +1 day
        }
    })
        .then(data => {
            res.send(data);
            // console.log({ data })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data."
            });
        });

};

// Retrieve all datas from the database.
exports.findAll = (req, res) => {
    const deviceId = req.query.deviceId;
    var condition = deviceId ? { deviceId: { $regex: new RegExp(deviceId), $options: "i" } } : {};

    Data.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data."
            });
        });
};

// Delete a data with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Data.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete data with id=${id}. Maybe data was not found!`
                });
            } else {
                res.send({
                    message: "data was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete data with id=" + id
            });
        });
};