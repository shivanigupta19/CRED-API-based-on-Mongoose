const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('dotenv');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({path : './config/config.env'});

 // Load models
 const Bootcamp = require('./models/Bootcamp');

 // Connect to db
 mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex: true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology: true
});

// Read the jSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json` , `utf-8`));

// Import into db
const importData = async()=>{
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data Imported ...'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// Delete data
const deleteData = async()=>{
    try {
        await Bootcamp.deleteMany();
        console.log('Data Destroyed ...'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}


if(process.argv[2] === '-i'){
  importData;
}else if(process.argv === 'd'){
   deleteData;
}