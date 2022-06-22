const util = require('util');
const cloudinary = require("cloudinary").v2;

const upload = util.promisify(cloudinary.uploader.upload);


module.exports = {upload};