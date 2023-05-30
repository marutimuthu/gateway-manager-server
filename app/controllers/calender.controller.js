const Calender = require("../models/calender.model.js")

exports.createCalender = async (req , res) => {
    const calender = new Calender(req.body) 

   await calender.save()
   res.send(calender)
}

exports.findCalender = async (req , res) => {
    const calender = await Calender.find({})

    res.send(calender)
}

exports.findOneCalender = async (req , res) => {
    let calender = await Calender.findById(req.params.id)
    
    if (!calender) {
        return res.render('error/404')
      }

    res.send(calender)
}

exports.updateCalender = async (req , res) => {
    const {id} = req.body

    console.log(req.body)
    const calender = await Calender.findByIdAndUpdate(id , req.body);

    if (!calender) {
        return res.render('error/404')
      }
    await calender.save();
    res.send(calender)
    console.log(calender)
}

exports.deleteCalender = async (req, res) => {
    const { id } = req.params;
    await Calender.findByIdAndDelete(id);
    res.send("deleted")
}