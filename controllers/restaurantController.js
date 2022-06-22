const {Menu} = require('../models');
const clearFolder = require('../services/clearFolder');
const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');


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

exports.editMenu = async (req, res, next) => {
    try {
        const {name, price, description} = req.body;
        const {menuId} = req.params;

        const restaurant = req.user;
        const menu = await Menu.findByPk(menuId);

        if (!menu) createError("Menu not found", 400);

        if (menu.restaurantId !== restaurant.id) createError("You are unauthorized", 403);

        menu.name = name;
        menu.price = price;
        menu.description = description;

        if (req.imageFile && menu.menuImagePublicId) {
            const deleteRes = await destroy(menu.menuImagePublicId);
            console.log(deleteRes);
            menu.menuImagePublicId = req.imageFile.public_id;
            menu.menuImage = req.imageFile.secure_url;
        }

        await menu.save();

        res.json({menu});
        
    } catch (err) {
        next(err)
    } finally {
        clearFolder('./public/images')
       }
}
