const cloudinary = require("../utils/cloudinary");

const uploadImage = async (req, res, next) => {
  try {
    const imagePath = req.file.path;

    const response = await cloudinary.upload(imagePath);
    console.log(response);

    req.imageFile = response;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
