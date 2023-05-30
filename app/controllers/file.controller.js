const file = require("../controllers/file.controller.js");
const db = require("../models");
const File = db.file;

// Create and save new file record
exports.create = async (req, res) => {
    const _file = {
        name: req.file.filename,
        type: req.file.mimetype,
        size: req.file.size,
        user_id: req.body.user_id
    }
    // console.log(req.body.user_id)
    const file = new File(_file);

    // Save device in the database
    file
        .save(file)
        .then(data => {
            res.status(200).send({
                message: "File Uploaded."
            });
        })
        .catch(err => {
            res.status(500).send({
                // message: err.message || "Some error occurred while creating the file."
                message: "Some error occurred while creating the file."
            });
        });
};

// Find a single file with an id
exports.findByUserid = async (req, res) => {
    const user_id = req.params.id;

    try {
        // console.log(user_id)

        const data = await File.where("user_id")
            .equals(user_id)
            .sort('-createdAt')

        if (!data)
            res.status(404).send({ message: "Invalid id: " + user_id });
        else res.send(data);

        // console.log(data)
    } catch (err) {
        res
            .status(500)
            .send({ message: "Error retrieving data id: " + err.message });
    }
};

// Donwload file
exports.download = function (req, res) {
    const file = `${process.cwd()}/uploads/${req.params.filename}`;
    res.download(file); // Set disposition and send it.
};