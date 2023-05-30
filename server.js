const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors(corsOptions));

var corsOptions = {
  origin: "http://localhost:8080"
};

const connectDB = require('./app/config/db.config.js')
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app); 
require("./app/routes/device.routes")(app);
require("./app/routes/device_logs.routes")(app);
require("./app/routes/data.routes")(app);
require("./app/routes/calender.routes")(app);
require("./app/routes/file.routes")(app);
connectDB()

// const connectMQTT = require('./app/config/mqtt.config.js')

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is live at port [ ${PORT} ]`);
});