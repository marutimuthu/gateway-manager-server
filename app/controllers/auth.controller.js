require('dotenv').config()
const db = require("../models");
const User = db.user;
const Role = db.role;
const Device = db.device;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Instantiate Haikunator without options
var Haikunator = require('haikunator')
var haikunator = new Haikunator()
// console.log(haikunator.haikunate({ tokenLength: 0 })) // => "cold-wildflower")

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    phoneno: req.body.phoneno,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.register = (req, res) => {
  // console.log(req.body)
  JSON.stringify(req.body)
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        // return res.status(200).send({ message: "User Not found." });
        return res.status(200).send(req.body);
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      // Auth done! 
      if (req.body.data.mac_id !== undefined) {
        // Check if device exists
        Device.findOne({
          mac_id: req.body.data.mac_id,
        })
          .exec((err, device) => {
            // console.log(device)
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            
            if (device) {
              // If device exists 
              // Device object ID is added to user schema
              User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { devices: device._id } },
                function (error, success) {
                  if (error) {
                    // console.log(error);
                    res.status(500).send({ message: error });
                    return;
                  } else {
                    // console.log(success);
                    // res.status(200).send({ message: success });
                    return res.status(200).send({ message: "Device registered to new user.", id: `${device._id}` });
                  }
                });
            }
            else {

              // If device does not exist create device
              var new_device = req.body.data
              var _test = new_device;
              if (!req.body.data.name){
                _test = Object.assign(new_device, { name: haikunator.haikunate() })
              }
              // console.log(_test)
              const device = new Device(_test);

              device
              .save(device)
              .then(data => {
                  // console.log(data)
                  // Device object ID is added to user schema
                  User.findOneAndUpdate(
                    { _id: user._id },
                    { $push: { devices: data._id } },
                    function (error, success) {
                      if (error) {
                        res.status(500).send({ message: error });
                        console.log(error);
                      } else {
                        // res.status(200).send({ message: success });
                        // console.log(success);
                        res.status(200).send({
                          message: "Device Registered",
                          id: `${data._id}`
                        });
                      }
                    });
                })
                .catch(err => {
                  // console.log("not ok")
                  res.status(500).send({
                    message:
                      err.message || "Some error occurred while creating the device."
                  });
                });
            }
          })
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the device."
        });
      }

    });
};