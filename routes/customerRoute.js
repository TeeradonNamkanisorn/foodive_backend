const router = require('express').Router();
const multer = require('../middlewares/upload');
const customerController = require('../controllers/customerController');
const { uploadImage } = require('../middlewares/cloudinaryUploads');
const authenticator = require('../middlewares/authenticator');

router.get('/getMe', customerController.getMe);

router.post(
  '/addCart',
  authenticator('customer'),
  customerController.createCart,
);

router.patch(
  '/update',
  multer.single('profileImage'),
  uploadImage,
  customerController.updateProfile,
);

// customer address
router.post('/address', customerController.createAddress);

router.delete('/address/:addressId', customerController.deleteAddress);

module.exports = router;