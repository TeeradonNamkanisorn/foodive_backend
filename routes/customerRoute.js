const router = require("express").Router();
const multer = require("../middlewares/upload");
const customerController = require("../controllers/customerController");
const { uploadImage } = require("../middlewares/cloudinaryUploads");

router.get("/getMe", customerController.getMe);
router.patch(
  "/update",
  multer.single("profileImage"),
  uploadImage,
  customerController.updateProfile
);

module.exports = router;
