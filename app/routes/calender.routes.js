module.exports = app => {
    const calender = require("../controllers/calender.controller.js");
    var router = require("express").Router();
    
    router.post("/", calender.createCalender );
    router.get("/:id" , calender.findOneCalender)
    router.put("/" , calender.updateCalender)
    router.get("/", calender.findCalender);
    router.delete("/:id", calender.deleteCalender);
    
    app.use('/api/calendar', router);
}
