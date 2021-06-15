const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
// const logger = require('./middleware/logger');
// load env vars
dotenv.config();
connectDB();
const morgan = require('morgan');
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// app.use(logger);
// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
// File loaders
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname , 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);
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




