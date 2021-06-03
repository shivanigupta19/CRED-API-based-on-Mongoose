const express = require('express');
const router = express.Router();
const { createBootcamp,deleteBootcamp,getBootcamp,getBootcamps,updateBootcamp } = require('../controllers/bootcamps');

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
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