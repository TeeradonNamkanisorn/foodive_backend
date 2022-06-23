const createError = require("../services/createError");
const { destroy } = require("../utils/cloudinary");

//   get 1 customer who login
exports.getMe = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, firstName, lastName } = req.body;
    const customer = req.user;

    if (!customer) {
      createError("You are unauthorized", 400);
    }

    // check if not have any data to update
    if (Object.keys(req.body).length === 0 && !req.imageFile) {
      createError("You cannot update empty data", 400);
    }

    customer.name = name;
    customer.firstName = firstName;
    customer.lastName = lastName;

    // if have customer profile image, then destroy image before update new image
    if (req.imageFile && customer.profileImage) {
      const deleteRes = await destroy(customer.profileImagePublicId);
      console.log(deleteRes);
      customer.profileImagePublicId = req.imageFile.public_id;
      customer.profileImage = req.imageFile.secure_url;
    }

    await customer.save();

    res.json({ message: "Update profile success" });
  } catch (err) {
    next(err);
  }
};
