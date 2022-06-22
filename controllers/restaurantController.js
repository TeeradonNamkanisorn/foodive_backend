const {Menu, MenuOption, sequelize} = require('../models');
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

exports.addOptions = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        //options is an array
        //[{name: "abc", price: 10}, {}, {}]
        const {options} = req.body;
        const {menuId} = req.params;
        
        console.log(options);

        const optionItems = []
        for (let option of options) {
            if (isNaN(option.price)) createError("invalid request body");
            if (!option.name || option?.name?.trim() === "") createError("option name cannot be blank");
            optionItems.push({name: option.name, price: option.price, menuId})
        };
        
        
        
        const menuOptions = await MenuOption.bulkCreate(optionItems, {transaction: t});
        const menu = await Menu.findOne({where: {
            id: menuId
        }, include: MenuOption,
        transaction: t})
        
        if (!menu) createError("menu not found", 400);

        
        await t.commit();
        res.json({menu})

    } catch (err) {
        await t.rollback()
        next(err)
    }
}

exports.modifyOptions = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const {options} = req.body;
        const {menuId} = req.params;

        //Slightly inefficient but errors can be detected better this way.
        let menuOptions = await MenuOption.findAll({where: {
            menuId
        }})

        menuOptions = JSON.parse(JSON.stringify(menuOptions));
        const menuOptionIds = menuOptions.map(e => e.id);

       

        for (let option of options) {
            const price = option.price;
            const name = option.name;
            const id = option.id;

            
            if (!menuOptionIds.includes(id)) createError("invalid menu option item", 400);
            if (isNaN(option.price)) createError("invalid request body");
            if (!option.name || option?.name?.trim() === "") createError("option name cannot be blank");

            await MenuOption.update({price, name},{where: {
                id
            }, transaction : t})

        }

        const menu = await Menu.findOne({where: {
            id: menuId
        }, 
            include: MenuOption,
        transaction : t})

        await t.commit();
        res.json({menu});

    } catch (error) {
        await t.rollback()
        next(error)
    }
}
