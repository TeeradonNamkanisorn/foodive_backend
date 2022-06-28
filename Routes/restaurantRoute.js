const multer = require('../middlewares/upload');

const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const { uploadImage } = require('../middlewares/cloudinaryUploads');

router.get('/getMe', restaurantController.getMe);

router.patch(
  '/update',
  multer.single('image'),
  uploadImage,
  restaurantController.updateRestaurant,
);

router.patch('/updateStatus', restaurantController.updateStatusRes);
// router.patch("/updateStatus",restaurantController.updateAddressRes)

router.post(
  '/:restaurantId/addMenu',
  multer.single('menuImage'),
  uploadImage,
  restaurantController.addMenu,
);

router.put(
  '/:restaurantId/menu/:menuId',
  multer.single('menuImage'),
  uploadImage,
  restaurantController.editMenu,
);
// router.post(
//   '/:restaurantId/menu/:menuId/addOptions',
//   restaurantController.addOptions,
// );

// router.put(
//   '/:restaurantId/menu/:menuId/menu-options/',
//   restaurantController.modifyOptions,
// );

router.post('/assign-tags', restaurantController.assignTags);
router.put('/change-tags', restaurantController.changeTags);
router.get('/pickDriver', restaurantController.pickDriver);

module.exports = router;
