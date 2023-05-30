module.exports = app => {
    const data = require("../controllers/data.controller.js");

    var router = require("express").Router();

    router.post("/", data.create);

    //Get All Data
    router.get('/' , data.displayData)

    //Get Data of last MOnth
    router.get('/month' , data.month)

    //Get Data of Last Week
    router.get('/week' , data.week)
    
    // Retrieve all data
    router.get("/", data.findAll);

    // Find data with deviceid, from and to
    router.get("/:id/:from/:to", data.find);

    // router.get("/:id/:from/:to", data.find);
    // router.get(`/from/to`, data.find);

    router.delete("/:id", data.delete);

    // router.delete("/", data.deleteAll);

    app.use('/api/data', router);
};