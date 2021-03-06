const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

 // Load models
 const Bootcamp = require('./models/Bootcamp');
 const Course = require('./models/Course');

 // Connect to db
 mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex: true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology: true
});

// Read the jSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json` , `utf-8`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json` , `utf-8`));
// Import into db
const importData = async()=>{
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
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
        await Course.deleteMany();
        console.log('Data Destroyed ...'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}


if(process.argv[2] === '-i'){
  importData();
}else if(process.argv[2] === '-d'){
   deleteData();
}