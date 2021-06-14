const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req,res,next) => {
    // res.status(200).json({success : true , msg : 'show all the bootcamps'});
   // try {
      //  const bootcamps = await Bootcamp.find();
        res.status(200).json(res.advancedResult);
    //} catch (error) {
       // res.status(400).json({success : false});
       next(error);
    //}
});


// @desc get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async(req,res,next) =>{
    //res.status(200).json({success : true , msg : `show all the bootcamps at ${req.params.id}`});
   // try {
        const bootcamps = await Bootcamp.findById(req.params.id);
        if(!bootcamps){
           // return res.status(400).json({success : false}); 
           return ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404);
        }
        res.status(200).json({
            success : true,
            data : bootcamps
        });
    // } catch (error) {
     //   res.status(400).json({success : false});
    // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    //  next(error);
    // }
});
// @desc create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req,res,next) =>{
    // console.log(req.body);
    // res.status(200).json({success : true , msg : 'create all the bootcamps'});
//    try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success : true,
        data : bootcamp
    });
//    } catch (error) {
       // res.status(400).json({success : false});
//       next(error);
//    }
});
// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async(req,res,next) =>{
    //res.status(200).json({success : true , msg : `update all the bootcamps at ${req.params.id}`});
   // try {
        const bootcamps = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators : true
        });
        // not present in database but a formatted object id
        if(!bootcamps){
           // return res.status(400).json({success : false}); 
           return ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404);
        }
        res.status(200).json({
            success : true,
            data : bootcamps
        });

   // }
    // not a formatted object id and not present in databse
   //  catch (error) {
      //  res.status(400).json({success : false});
     // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
   //  next(error);
    //}
});
// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp =asyncHandler(async (req,res,next) =>{
  //  res.status(200).json({success : true , msg : `delete all the bootcamps at ${req.params.id}`});
 // try {
    const bootcamps = await Bootcamp.findById(req.params.id);
    if(!bootcamps){
       // return res.status(400).json({success : false}); 
       return  ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404);
    }
    bootcamp.remove();
    res.status(200).json({
        success : true,
        data : {}
    });
//} catch (error) {
   // res.status(400).json({success : false});
  // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
//  next(error);
//}
});

// @desc get bootcamp within a radius
// @route GET /api/v1/bootcamps/:zipcode/:distance
// @access private
exports.getBootcampsInRadius =asyncHandler(async (req,res,next) =>{
    const{zipcode , distance} = req.params; 
    // Get latitude and longitude from the geocoder
    const  loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    // Calc radius using radians
    // Divide distance by radius of earth 
    // earth radius = 3963 miles or 6378 km
    const radius = distance/3963;
    const bootcamps = await Bootcamp.find(
        {
            location : {
                $geoWithin:{
                    $centerSphere : [[
                        lng, lat
                    ],radius]
                }
            }
        }
    );
res.status(200).json({success:true,count:bootcamps.length,data:bootcamps});
  });
// @desc Upload photo for bootcamp
// @route DELETE /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload =asyncHandler(async (req,res,next) =>{
    const bootcamps = await Bootcamp.findById(req.params.id);
    if(!bootcamps){
       return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    }
    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`,400));
    }
    const file = req.files.file;
    console.log(file);
    // Make sure that the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file`,400));
    }
    // Check file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400));
    }
    // Create custom file name
    file.name = `photo_${bootcamps._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err => {
        if(err){
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`,500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id , {photo : file.name});
        res.status(200).json({
            success : true,
            data : file.name
        });
    });
    
});