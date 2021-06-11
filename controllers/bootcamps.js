const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req,res,next) => {
    let query;
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);
    console.log(queryStr);
    query = Bootcamp.find(JSON.parse(queryStr));
    const bootcamps = await query;
    // res.status(200).json({success : true , msg : 'show all the bootcamps'});
   // try {
      //  const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success : true,
            count : bootcamps.length,
            data : bootcamps,

        });
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
// @route DELETE /api/v1/bootcamps
// @access private
exports.deleteBootcamp =asyncHandler(async (req,res,next) =>{
  //  res.status(200).json({success : true , msg : `delete all the bootcamps at ${req.params.id}`});
 // try {
    const bootcamps = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamps){
       // return res.status(400).json({success : false}); 
       return  ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404);
    }
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