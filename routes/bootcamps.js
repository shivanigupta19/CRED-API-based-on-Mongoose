const express = require('express');
const router = express.Router();
const { createBootcamp,deleteBootcamp,getBootcamp,getBootcamps,updateBootcamp,getBootcampsInRadius,bootcampPhotoUpload } = 
require('../controllers/bootcamps');
const advancedResult = require('../middleware/advancedResult');
const Bootcamp = require('../models/Bootcamp');

// Include other resource router
const courseRouter = require('./courses');
const course = express.Router();
const { protect } = require('../middleware/auth');
// Re-route into other resource router
router.use('/:bootcampId/courses',courseRouter); 
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id/photo').put(protect, bootcampPhotoUpload);


router.route('/').get(advancedResult(Bootcamp,'courses'), getBootcamps).post(protect , createBootcamp);
router.route('/:id').get(getBootcamp).put(protect ,protect , deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
// router.get('/' , (req,res) => {
//     res.status(200).json({success : true , msg : 'show all the bootcamps'});
// });
// router.get('/:id' , (req,res) => {
//     res.status(200).json({success : true , msg : `show all the bootcamps at ${req.params.id}`});
// });
// router.post('' , (req,res) => {
//     res.status(200).json({success : true , msg : 'create all the bootcamps'});
// });
// router.put('/:id' , (req,res) => {
//     res.status(200).json({success : true , msg : `update all the bootcamps at ${req.params.id}`});
// });
// router.delete('/:id' , (req,res) => {
//     res.status(200).json({success : true , msg : `delete all the bootcamps at ${req.params.id}`});
// });
module.exports = router;