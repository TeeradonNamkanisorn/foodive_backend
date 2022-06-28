const {
  Menu,
  MenuOption,
  sequelize,
  MenuOptionGroup,
  MenuTag,
  Driver,
  Category,
  Restaurant,
} = require('../models');
const { Op } = require('sequelize');
const getDistanceFromLatLonInKm = require('../services/calcDistance');
const clearFolder = require('../services/clearFolder');
const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');

exports.getMe = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    const restaurant = await Restaurant.findByPk(user.id);
    res.json({ restaurant });
  } catch (err) {
    next(err);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    // UPDATE : name , image
    const { name } = req.body;
    const restaurant = req.user;

    if (!restaurant) {
      createError('You are unauthorized.', 400);
    }

    if (!req.imageFile && !name) {
      createError('Cannot update empty value.', 400);
    }

    if (name) {
      restaurant.name = name;
    }

    // check if image have file image or not.
    // if have file image then remove image.
    if (req.imageFile && restaurant.image) {
      const deletePreviousImage = await destroy(restaurant.imagePublicId);
      console.log(deletePreviousImage);
    }

    if (req.imageFile) {
      restaurant.imagePublicId = req.imageFile.public_id;
      restaurant.image = req.imageFile.secure_url;
    }

    await restaurant.save();

    res.json({ message: 'Update profile restaurant success.' });
  } catch (err) {
    next(err);
  }
};

exports.updateStatusRes = async (req, res, next) => {
  try {
    // ENUM('open', 'close')
    const { status } = req.body;
    const restaurant = req.user;

    console.log(status);

    if (status !== 'open' && status !== 'close') {
      createError('Status must be "open" or "close"', 400);
    }

    if (restaurant.status === status) {
      createError(
        'New status is equal current status. Please change value of new status. ',
        400,
      );
    }

    if (status) {
      restaurant.status = status;
    }

    await restaurant.save();

    console.log(restaurant.status);

    res.json({ message: 'Change status restaurant success.' });
  } catch (err) {
    next(err);
  }
};

exports.updateAddressRes = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    const restaurant = req.user;

    if (!latitude && !longitude) {
      createError('Address is required', 400);
    }

    if ((longitude, latitude)) {
      restaurant.longitude = longitude;
      restaurant.latitude = latitude;
    }

    await restaurant.save();

    res.json({ message: 'Update store location is success' });
  } catch (err) {
    next(err);
  }
};

exports.addMenu = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const restaurant = req.user;
    if (restaurant.status !== 'close') {
      createError('Restaurant must be closed first before editing');
    }
    const { name, price, description, categoryId } = req.body;
    const menuOptionGroups = JSON.parse(req.body.menuOptionGroups);

    const { restaurantId } = req.params;
    const imageFile = req.imageFile;

    const menuImage = imageFile.secure_url;
    const menuImagePublicId = imageFile.public_id;

    if (price == null) createError('Price is required', 400);
    if (!name) createError('Menu name is required', 400);
    if (!menuImage) createError('Menu image is required', 400);

    const restaurantOtherCategory = await Category.findOne(
      {
        where: {
          name: 'other',
          restaurantId: restaurantId,
        },
      },
      { transaction: t },
    );

    console.log(categoryId, restaurantOtherCategory.id);

    const menu = await Menu.create(
      {
        name,
        price,
        description,
        menuImage,
        menuImagePublicId,
        restaurantId,
        categoryId: categoryId || restaurantOtherCategory.id,
      },
      { transaction: t },
    );

    const menuId = menu.id;

    for (let optionGroup of menuOptionGroups) {
      const optionGroupName = optionGroup.name;
      const numberLimit = optionGroup.numberLimit;
      //validate later

      const menuOpGroup = await MenuOptionGroup.create(
        { name: optionGroupName, numberLimit, menuId },
        { transaction: t },
      );

      for (let option of optionGroup.menuOptions) {
        const optionName = option.name;
        const optionPrice = option.price;
        const optionGroupId = menuOpGroup.id;
        //validate later

        await MenuOption.create(
          {
            name: optionName,
            price: optionPrice,
            menuOptionGroupId: optionGroupId,
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    res.status(201).json({ menu });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    clearFolder('./public/images');
  }
};

exports.editMenu = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, price, description } = req.body;

    const menuOptionGroups = JSON.parse(req.body.menuOptionGroups);

    const imageFile = req.imageFile;

    const { menuId } = req.params;
    const menuOptionGroupsToBeDeleted = await MenuOptionGroup.findAll({
      where: {
        menuId,
      },
    });
    const groupIdsToBeDeleted = await menuOptionGroupsToBeDeleted.map(
      (e) => e.id,
    );

    console.log(menuId);

    const restaurant = req.user;
    const menu = await Menu.findByPk(menuId, { transaction: t });

    if (!menu) createError('Menu not found', 400);

    if (menu.restaurantId !== restaurant.id)
      createError('You are unauthorized', 403);

    let menuImagePublicId;
    let menuImage;

    if (req.imageFile && menu.menuImagePublicId) {
      const deleteRes = await destroy(menu.menuImagePublicId);
      console.log(deleteRes);
      menuImagePublicId = req.imageFile.public_id;
      menuImage = req.imageFile.secure_url;
    }

    await Menu.update(
      { name, price, description, menuImagePublicId, menuImage },
      {
        where: {
          id: menuId,
        },
        transaction: t,
      },
    );

    await MenuOption.update(
      {
        status: 'DEACTIVATED',
      },
      {
        where: {
          menuOptionGroupId: {
            [Op.in]: groupIdsToBeDeleted,
          },
        },
      },
      { transaction: t },
    );

    await MenuOptionGroup.update(
      {
        status: 'DEACTIVATED',
      },
      {
        where: {
          id: {
            [Op.in]: groupIdsToBeDeleted,
          },
        },
        transaction: t,
      },
    );

    for (let optionGroup of menuOptionGroups) {
      const optionGroupName = optionGroup.name;
      const numberLimit = optionGroup.numberLimit;
      //validate later

      const menuOpGroup = await MenuOptionGroup.create(
        { name: optionGroupName, numberLimit, menuId },
        { transaction: t },
      );

      for (let option of optionGroup.menuOptions) {
        const optionName = option.name;
        const optionPrice = option.price;
        const optionGroupId = menuOpGroup.id;
        //validate later

        await MenuOption.create(
          {
            name: optionName,
            price: optionPrice,
            menuOptionGroupId: optionGroupId,
          },
          { transaction: t },
        );
      }
    }

    const responseMenu = await Menu.findByPk(menuId, {
      include: {
        model: MenuOptionGroup,
        where: { status: 'ACTIVE' },
        include: {
          model: MenuOption,
          where: { status: 'ACTIVE' },
        },
      },
      transaction: t,
    });

    await t.commit();
    res.json({ menu: responseMenu });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    clearFolder('./public/images');
  }
};

// exports.addOptions = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     // {menuOptionGroups: [{name: 'abc', groupLimit: 1(optional),
//     //  menuOptions: [ {name price} ]
//     //   }]}

//     const { menuId } = req.params;
//     const { menuOptionGroups } = req.body;

//     for (let optionGroup of menuOptionGroups) {
//       const optionGroupName = optionGroup.name;
//       const numberLimit = optionGroup.numberLimit;
//       //validate later

//       const menuOpGroup = await MenuOptionGroup.create(
//         { name: optionGroupName, numberLimit, menuId },
//         { transaction: t },
//       );

//       for (let option of optionGroup.menuOptions) {
//         const optionName = option.name;
//         const optionPrice = option.price;
//         const optionGroupId = menuOpGroup.id;
//         //validate later

//         await MenuOption.create(
//           {
//             name: optionName,
//             price: optionPrice,
//             menuOptionGroupId: optionGroupId,
//           },
//           { transaction: t },
//         );
//       }
//     }

//     const menu = await Menu.findByPk(menuId, {
//       include: {
//         model: MenuOptionGroup,
//         include: MenuOption,
//       },
//       transaction: t,
//     });
//     await t.commit();
//     res.json({ menu });
//   } catch (err) {
//     await t.rollback();
//     next(err);
//   }
// };

// exports.modifyOptions = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { optionGroups } = req.body;

//     //Theses are used to validate, will do this later
//     const { menuId } = req.params;
//     // let menuOptions = await MenuOption.findAll({where: {
//     //     menuId
//     // }})

//     // menuOptions = JSON.parse(JSON.stringify(menuOptions));
//     // const menuOptionIds = menuOptions.map(e => e.id);

//     for (let optionGroup of optionGroups) {
//       const name = optionGroup.name;
//       const numberLimit = optionGroup.numberLimit;
//       const id = optionGroup.id;

//       await MenuOptionGroup.update(
//         { name, numberLimit },
//         {
//           where: {
//             id,
//           },
//           transaction: t,
//         },
//       );

//       // if (!menuOptionIds.includes(id)) createError("invalid menu option item", 400);

//       for (let option of optionGroup.menuOptions) {
//         const optionName = option.name;
//         const optionPrice = option.price;
//         const optionId = option.id;

//         if (isNaN(optionPrice) && optionPrice !== undefined)
//           createError('invalid request body');
//         if (!optionName || optionName.trim() === '')
//           createError('option name cannot be blank');

//         await MenuOption.update(
//           { name: optionName, price: optionPrice },
//           {
//             where: {
//               id: optionId,
//             },
//             transaction: t,
//           },
//         );
//       }
//     }

//     const menu = await Menu.findOne({
//       where: {
//         id: menuId,
//       },
//       include: {
//         model: MenuOptionGroup,
//         include: MenuOption,
//       },
//       transaction: t,
//     });

//     await t.commit();
//     res.json({ menu });
//   } catch (error) {
//     await t.rollback();
//     next(error);
//   }
// };

exports.addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const restaurantId = req.user.id;

    const category = await Category.create({ restaurantId, name });

    res.json({ category });
  } catch (err) {
    next(err);
  }
};

exports.assignCategory = async (req, res, next) => {
  try {
    const { menuId, categoryId } = req.body;
    await Menu.update(
      { categoryId },
      {
        where: {
          id: menuId,
        },
      },
    );

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const restaurantId = req.user.id;
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId, { transaction: t });

    if (category.name === 'other')
      createError('You cannot delete this category');

    const menus = await Menu.findAll({
      where: {
        categoryId,
      },
    });

    const menuIds = JSON.parse(JSON.stringify(menus)).map((menu) => menu.id);
    const otherCategory = await Category.findOne({
      where: {
        name: 'other',
        restaurantId,
      },
    });

    await Menu.update(
      {
        categoryId: otherCategory.id,
      },
      {
        where: {
          id: {
            [Op.in]: menuIds,
          },
        },
      },
    );

    await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.assignTags = async (req, res, next) => {
  try {
    const { tagIds, menuId } = req.body;
    const { id: restaurantId } = req.user;

    const arr = tagIds.map((cat) => ({
      tagId: cat,
      menuId,
      restaurantId,
    }));
    console.log(arr);

    await MenuTag.bulkCreate(arr);

    res.json({ message: 'Success!' });
  } catch (err) {
    next(err);
  }
};

exports.changeTags = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const restaurantId = req.user.id;
    const { tagIds, menuId } = req.body;
    await MenuTag.destroy({
      where: {
        menuId,
      },
      transaction: t,
    });

    const arr = tagIds.map((cat) => ({
      tagId: cat,
      menuId,
      restaurantId,
    }));

    await MenuTag.bulkCreate(arr, { transaction: t });

    await t.commit();
    res.json({ message: 'Updated Successfully!' });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

//Need to add third driver status : waiting
exports.pickDriver = async (req, res, next) => {
  try {
    const restaurant = req.user;
    const { latitude, longitude } = restaurant;
    let driverData = await Driver.findAll({
      attributes: [
        'id',
        'latitude',
        'longitude',
        'firstName',
        'lastName',
        'phoneNumber',
      ],
    });

    driverData = JSON.parse(JSON.stringify(driverData));
    if (!driverData) createError('driver not found');
    driverData.sort((a, b) => {
      const distanceFromA = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        a.latitude,
        a.longitude,
      );
      const distanceFromB = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        b.latitude,
        b.longitude,
      );
      return distanceFromA - distanceFromB;
    });

    const chosenDriver = driverData[0];

    chosenDriver.distance = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      chosenDriver.latitude,
      chosenDriver.longitude,
    );
    //
    res.json({ driver: chosenDriver });
  } catch (err) {
    next(err);
  }
};
