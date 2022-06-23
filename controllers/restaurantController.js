const {Menu, MenuOption, sequelize, MenuOptionGroup} = require('../models');
const clearFolder = require('../services/clearFolder');
const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');


exports.addMenu = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    const { restaurantId } = req.params;
    const imageFile = req.imageFile;

    const menuImage = imageFile.secure_url;
    const menuImagePublicId = imageFile.public_id;

    if (price == null) createError("Price is required", 400);
    if (!name) createError("Menu name is required", 400);
    if (!menuImage) createError("Menu image is required", 400);


    const menu = await Menu.create({name, price, description, menuImage, menuImagePublicId, restaurantId});

    res.status(201).json({menu});
   } catch (err) {
    next(err)
   } finally {
    clearFolder('./public/images')
   }
}

exports.editMenu = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    const { menuId } = req.params;

    const restaurant = req.user;
    const menu = await Menu.findByPk(menuId);

    if (!menu) createError("Menu not found", 400);

    if (menu.restaurantId !== restaurant.id)
      createError("You are unauthorized", 403);

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

    res.json({ menu });
  } catch (err) {
    next(err);
  } finally {
    clearFolder("./public/images");
  }
};



exports.addOptions = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        // {menuOptionGroups: [{name: 'abc', groupLimit: 1(optional), 
        //  menuOptions: [ {name price} ]
        //   }]}

        const {menuId} = req.params;
        const {menuOptionGroups} = req.body;

        for (let optionGroup of menuOptionGroups) {
            const optionGroupName= optionGroup.name
            const numberLimit = optionGroup.numberLimit;
            //validate later

            const menuOpGroup = await MenuOptionGroup.create({name: optionGroupName, numberLimit, menuId}, {transaction : t});
            console.log(menuOpGroup.id)
            for (let option of optionGroup.menuOptions) {
                const optionName = option.name;
                const optionPrice = option.price;
                const optionGroupId = menuOpGroup.id;
                //validate later

                await MenuOption.create({name: optionName, price: optionPrice, menuOptionGroupId:optionGroupId}, {transaction : t})

            }
        }

        const menu = await Menu.findByPk(menuId, {
            include: {
                model: MenuOptionGroup,
                include: MenuOption
            },
            transaction :t
        })
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
        const {optionGroups} = req.body;

        //Theses are used to validate, will do this later
        const {menuId} = req.params;
        // let menuOptions = await MenuOption.findAll({where: {
        //     menuId
        // }})

        // menuOptions = JSON.parse(JSON.stringify(menuOptions));
        // const menuOptionIds = menuOptions.map(e => e.id);


        for (let optionGroup of optionGroups) {
            const name = optionGroup.name;
            const numberLimit = optionGroup.numberLimit
            const id = optionGroup.id;

            await MenuOptionGroup.update({name, numberLimit}, {where: {
                id
            }, transaction : t})

            // if (!menuOptionIds.includes(id)) createError("invalid menu option item", 400);
            
            for (let option of optionGroup.menuOptions) {
                const optionName = option.name;
                const optionPrice = option.price;
                const optionId = option.id

                if (isNaN(optionPrice) && optionPrice !== undefined) createError("invalid request body");
                if (!optionName || optionName.trim() === "") createError("option name cannot be blank");

                await MenuOption.update({name: optionName, price:optionPrice}, {
                    where: {
                        id: optionId
                    },
                    transaction : t})
            }
        }


    const menu = await Menu.findOne({
      where: {
        id: menuId,
      },
      include: {
        model: MenuOptionGroup,
        include: MenuOption
      },
      transaction: t,
    });

    await t.commit();
    res.json({ menu });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
