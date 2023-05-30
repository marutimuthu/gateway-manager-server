const mongoose = require('mongoose');
const dotevn = require("dotenv");
const datas = require('./dummyData.js')
const Data = require('./app/models/dataModel')

const connectDB = require('../app/config/db.config');

dotevn.config();
connectDB()

const importData = async () => {
    try {
        // await Data.deleteMany()

       const sampleData = datas.map((i) => {
            return { ...i }
       })

       await Data.insertMany(sampleData);
       console.log('Data imported!' )
       process.exit()
    }
    catch(error) {
        console.log(`Error:${error}`)
        process.exit(1)
    }
} 

const destroyData = async () => {
    try {
        await Data.deleteMany() 
       console.log('Data Destroyed!' )
       process.exit()
    }
    catch(error) {
        console.log(`Error:${error}`)
        process.exit(1)
    }
} 

if(process.argv[2] === "-d") {
    destroyData()
}else{
    importData()
}
