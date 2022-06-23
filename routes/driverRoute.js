const router = require("express").Router();
const multer = require("../middlewares/upload");
const { uploadImage } = require("../middlewares/cloudinaryUploads");
const driverController = require("../controllers/driverController");

router.get("/getMe", driverController.getMe);
router.patch(
  "/updateProfile",
  multer.single("driverImage"),
  uploadImage,
  driverController.updateProfile
);
router.patch("/updateStatus", driverController.updateStatus);

module.exports = router;
