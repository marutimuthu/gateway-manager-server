const mongoose = require('mongoose');
require('dotenv').config()

const db = require("../models");
const Role = db.role;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      //  useCreateIndex: true,
       useUnifiedTopology: true,
      //  useFindAndModify: false
    })
    console.log(`🚀 MongoDB Connected: [ ${conn.connection.host} ]`)
    initial();
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

module.exports = connectDB;