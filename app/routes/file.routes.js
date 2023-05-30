module.exports = app => {
    const file = require("../controllers/file.controller.js");
    var router = require("express").Router();
    const multer = require('multer');

    //Configuration for Multer
    const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads");
        },
        filename: (req, file, cb) => {
            // console.log(file)
            const ext = file.mimetype.split("/")[1];
            // cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
            // cb(null, `${file.originalname}.${ext}`);
            cb(null, `${file.originalname}`);
        },
    });

    // Multer Filter
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.split("/")[1] === "pdf") {
            cb(null, true);
        } else {
            cb(new Error("Not a PDF File!!"), false);
        }
    };

    // Calling the "multer" Function
    // const upload = multer({ dest: 'uploads/' })

    //Calling the "multer" Function
    const upload = multer({
        storage: multerStorage,
        // fileFilter: multerFilter,
    });

    // Create a new File
    router.post("/", upload.single('file'), file.create);

    // Find user Files
    router.get("/:id", file.findByUserid);

    // Download file
    router.get('/download/:filename', file.download);

    // Retrieve all device
    // router.get("/", file.findAll);

    // // Delete a file with id
    // router.delete("/:id", file.delete);

    app.use('/api/file', router);
};
