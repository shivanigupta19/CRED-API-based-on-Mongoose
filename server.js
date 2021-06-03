const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const connectDB = require('./config/db');
const colors = require('colors');
// const logger = require('./middleware/logger');
// load env vars
dotenv.config({path : './config/config.env'});
connectDB();
const morgan = require('morgan');


const app = express();
app.use(express.json());

// app.use(logger);
// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps', bootcamps);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT , function(){
    console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold);
});
// handle unhandled promise rejections
process.on('unhandledRejection',(err,promise) => {
    console.log(`Error : ${err.message}`.red.bold);
    // close server and exit process
    server.close(() => {
        process.exit(1);
    });
});




