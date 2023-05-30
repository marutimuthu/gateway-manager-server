const mongoose = require("mongoose");

const calenderSchema = mongoose.Schema({
  date: {
    type: Date,
  },
  content: {
    type: String,
  },

});

const Calender = mongoose.model("Calender", calenderSchema);

module.exports = Calender;