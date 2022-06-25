const router = require('express').Router();
const multer = require('../middlewares/upload');
const customerController = require('../controllers/customerController');
const { uploadImage } = require('../middlewares/cloudinaryUploads');
const authenticator = require('../middlewares/authenticator');

router.get('/getMe', customerController.getMe);

router.post('/addCart', customerController.createCart);

router.post('/cart/:cartId/append-menu', customerController.appendMenu);

router.delete(
  '/cart/:cartId/delete-menu/:orderMenuId',
  customerController.removeMenu,
);

router.patch(
  '/cart/:cartId/modify-menu/:orderMenuId',
  customerController.modifyMenu,
);

router.post(
  '/update',
  multer.single('profileImage'),
  uploadImage,
  customerController.updateProfile,
);

// customer address
router.post('/address', customerController.createAddress);

router.delete('/address/:addressId', customerController.deleteAddress);

module.exports = router;
