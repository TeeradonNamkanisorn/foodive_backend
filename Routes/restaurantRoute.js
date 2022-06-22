const multer = require('../middlewares/upload')

const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const { uploadMenu } = require('../middlewares/cloudinaryUploads');

router.post('/:restaurantId/addMenu', multer.single('menuImage'), uploadMenu, restaurantController.addMenu)

module.exports = router;