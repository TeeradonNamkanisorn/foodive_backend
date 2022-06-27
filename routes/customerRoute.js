const router = require('express').Router();
const multer = require('../middlewares/upload');
const customerController = require('../controllers/customerController');
const { uploadImage } = require('../middlewares/cloudinaryUploads');
const authenticator = require('../middlewares/authenticator');

router.get('/getMe', customerController.getMe);

router.post('/addCart', customerController.createCart);

router.post('/cart/:cartId/append-menu', customerController.appendMenu);

router.delete('/deleteMenu', customerController.removeMenu);

router.put('/modifyMenu', customerController.modifyMenu);

router.post(
  '/update',
  multer.single('profileImage'),
  uploadImage,
  customerController.updateProfile,
);

router.get('/cart', customerController.getAllCarts);

// customer address
router.post('/address', customerController.createAddress);

router.delete('/address/:addressId', customerController.deleteAddress);

router.post('/getMenus', customerController.fetchMenus);

module.exports = router;
