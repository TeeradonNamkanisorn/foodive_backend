const util = require("util");
const cloudinary = require("cloudinary").v2;

//CLOUDINARY_URL= "YOUR_URL"
const upload = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

module.exports = { upload, destroy };
