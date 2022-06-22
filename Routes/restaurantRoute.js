const multer = require('../middlewares/upload')

const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const { uploadMenu } = require('../middlewares/cloudinaryUploads');

router.post('/:restaurantId/addMenu', multer.single('menuImage'), uploadMenu, restaurantController.addMenu)
router.put('/:restaurantId/menu/:menuId', multer.single('menuImage'), uploadMenu, restaurantController.editMenu)

module.exports = router;