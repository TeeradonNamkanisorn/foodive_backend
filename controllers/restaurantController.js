const {Menu} = require('../models');
const clearFolder = require('../services/clearFolder');
const createError = require('../services/createError');


exports.addMenu = async (req, res, next) => {
   try {
    const {name, price, description} = req.body;
    const { restaurantId }= req.params;
    const imageFile = req.imageFile;


    const menuImage = imageFile.secure_url;
    const menuImagePublicId = imageFile.public_id;

    if (price == null) createError('price is required', 400);
    if (!name) createError('Menu name is required', 400);
    if (!menuImage) createError('Menu image is required', 400);



    await Menu.create({name, price, description, menuImage, menuImagePublicId, restaurantId});

    res.sendStatus(204);
   } catch (err) {
    next(err)
   } finally {
    clearFolder('./public/images')
   }
}