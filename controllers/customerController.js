const { menuList } = require('../services/getPrices');
const {
  Order,
  OrderMenu,
  sequelize,
  OrderMenuOption,
  Customer,
  MenuOption,
  Category,
  OrderMenuOptionGroup,
  MenuOptionGroup,
  Menu,
  Restaurant,
  Tag,
  Address,
} = require('../models');
const {
  calculatePriceFromMenuList,
  getCartMenuArrayWithoutOptions,
  getFullCart,
} = require('../services/cartServices');
const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');
const { Op } = require('sequelize');
const getDistanceFromLatLonInKm = require('../services/calcDistance');

module.exports.createCart = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { menus, restaurantId } = req.body;

    const order = await Order.create(
      {
        customerId: req.user.id,
        //driverId later when the restaurant confirms the order
        restaurantId,
      },
      {
        transaction: t,
      },
    );

    for (let menu of menus) {
      const menuId = menu.id;
      const menuComment = menu.comment;
      const orderMenu = await OrderMenu.create(
        { menuId, comment: menuComment, orderId: order.id },
        { transaction: t },
      );

      for (let optionGroup of menu.optionGroups) {
        const orderOptionGroup = await OrderMenuOptionGroup.create(
          {
            orderMenuId: orderMenu.id,
            menuOptionGroupId: optionGroup.id,
          },
          { transaction: t },
        );

        for (let option of optionGroup.options) {
          await OrderMenuOption.create(
            {
              orderMenuId: orderMenu.id,
              orderMenuOptionGroupId: orderOptionGroup.id,
              menuOptionId: option.id,
            },
            { transaction: t },
          );
        }
      }
    }

    const cart = await Order.findOne({
      where: {
        id: order.id,
      },
      include: {
        model: OrderMenu,
        include: {
          model: OrderMenuOptionGroup,
          include: {
            model: OrderMenuOption,
          },
        },
      },
      transaction: t,
    });

    await t.commit();
    res.json({ cart });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.appendMenu = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { menu } = req.body;
    const { cartId: orderId } = req.params;

    const orderMenu = await OrderMenu.create({
      orderId,
      comment: menu.comment,
      menuId: menu.id,
    });

    for (let optionGroup of menu.optionGroups) {
      console.log('asdfasdfas', optionGroup.id);
      const orderOptionGroup = await OrderMenuOptionGroup.create(
        {
          orderMenuId: orderMenu.id,
          menuOptionGroupId: optionGroup.id,
        },
        { transaction: t },
      );

      for (let option of optionGroup.options) {
        await OrderMenuOption.create(
          {
            orderMenuId: orderMenu.id,
            orderMenuOptionGroupId: orderOptionGroup.id,
            menuOptionId: option.id,
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    const cart = await Order.findByPk(orderId);

    res.json({ message: 'successfully added menu to cart!' });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.removeMenu = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { orderMenuId } = req.body;

    const orderMenu = await OrderMenu.findByPk(orderMenuId, { transaction: t });

    const orderMenuOptionGroups = await OrderMenuOptionGroup.findAll({
      where: {
        orderMenuId: orderMenu.id,
      },
    });

    const optionGroupIds = orderMenuOptionGroups.map((el) => el.id);

    await OrderMenuOption.destroy({
      where: {
        orderMenuOptionGroupId: {
          [Op.in]: optionGroupIds,
        },
      },
      transaction: t,
    });

    await OrderMenuOptionGroup.destroy({
      where: {
        orderMenuId: orderMenu.id,
      },
      transaction: t,
    });

    await OrderMenu.destroy({
      where: {
        id: orderMenuId,
      },
      transaction: t,
    });

    await t.commit();
    res.sendStatus(204);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

//ต้อง Fetch ใหม่
exports.modifyMenu = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { newOrderMenuOptionGroups, comment, orderMenuId } = req.body;
    const orderMenuOptionGroups = await OrderMenuOptionGroup.findAll(
      {
        where: {
          orderMenuId,
        },
      },
      { transaction: t },
    );

    const orderMenuOptionGroupIds = JSON.parse(
      JSON.stringify(orderMenuOptionGroups),
    ).map((el) => el.id);

    await OrderMenu.update(
      { comment },
      {
        where: {
          id: orderMenuId,
        },
        transaction: t,
      },
    );

    await OrderMenuOption.destroy(
      {
        where: {
          orderMenuOptionGroupId: {
            [Op.in]: orderMenuOptionGroupIds,
          },
        },
      },
      { transaction: t },
    );

    await OrderMenuOptionGroup.destroy({
      where: {
        orderMenuId,
      },
      transaction: t,
    });

    for (let optionGroup of newOrderMenuOptionGroups) {
      const orderOptionGroup = await OrderMenuOptionGroup.create(
        {
          orderMenuId,
          menuOptionGroupId: optionGroup.id,
        },
        { transaction: t },
      );

      for (let option of optionGroup.options) {
        await OrderMenuOption.create(
          {
            orderMenuId,
            orderMenuOptionGroupId: orderOptionGroup.id,
            menuOptionId: option.id,
          },
          { transaction: t },
        );
      }
    }

    // await OrderMenuOptionGroup.create({
    //   orderMenuId,
    //   menuOptionGroupId
    // }, {transaction : t})

    // const newOptions = orderMenuOptions.map((e) => ({
    //   orderMenuId: orderMenuId,
    //   menuOptionId: e.id,
    // }));
    // await OrderMenuOption.bulkCreate(newOptions, { transaction: t });

    const orderMenu = await OrderMenu.findOne({
      where: {
        id: orderMenuId,
      },
      include: {
        model: OrderMenuOptionGroup,
        include: {
          model: OrderMenuOption,
        },
      },
      transaction: t,
    });

    await t.commit();

    res.json({ orderMenu });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

//
exports.fetchMenus = async (req, res, next) => {
  try {
    const { latitude, longitude, tag, keyword = '' } = req.body;
    let restaurants = await Restaurant.findAll({
      include: {
        model: Menu,
        include: {
          model: Tag,
          attributes: ['id', 'name'],
        },
      },
    });

    console.log(latitude, longitude);
    restaurants = JSON.parse(JSON.stringify(restaurants));

    restaurants = restaurants.map((restaurant) => {
      const matchedMenus = restaurant.Menus.filter((menu) => {
        // if part of the tags' string match the input tag
        if (!tag && keyword)
          return menu.name.toLowerCase().includes(keyword.toLowerCase());
        if (tag && !keyword) {
          return menu.Tags.some((curTag) =>
            curTag.name.toLowerCase().includes(tag.toLowerCase()),
          );
        }
        if (!tag && !keyword) return true;
        if (tag && keyword) {
          return (
            menu.Tags.some((curTag) =>
              curTag.name.toLowerCase().includes(tag.toLowerCase()),
            ) || menu.name.toLowerCase().includes(keyword.toLowerCase())
          );
        }
      });
      const matches = matchedMenus.length;

      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        restaurant.latitude,
        restaurant.longitude,
      );

      const score = matches / (distance + 1) ** 2;
      return { ...restaurant, Menus: matchedMenus, distance, matches, score };
    });

    restaurants.sort((a, b) => b.score - a.score);
    console.log(restaurants);

    // select one menu from restaurant
    let menus = restaurants.map((restaurant) => {
      // will write the algorithm here

      const chosenMenu = restaurant.Menus[0];

      return chosenMenu
        ? {
            id: chosenMenu.id,
            name: chosenMenu.name,
            description: chosenMenu.description,
            tags: chosenMenu.Tags,
            price: chosenMenu.price,
            menuImage: chosenMenu.menuImage,
            Restaurant: {
              name: restaurant.name,
              phoneNumber: restaurant.phoneNumber,
              status: restaurant.status,
              image: restaurant.image,
              distance: restaurant.distance,
              matches: restaurant.matches,
              score: restaurant.score,
            },
          }
        : null;
    });
    console.log(menus);
    menus = menus.filter((menu) => Boolean(menu));
    res.json({ menus });
  } catch (error) {
    next(error);
  }
};

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
    const { firstName, lastName } = req.body;
    const customer = req.user;

    if (!customer) {
      createError('You are unauthorized', 400);
    }

    // check if not have any data to update
    if (Object.keys(req.body).length === 0 && !req.imageFile) {
      createError('You cannot update empty data', 400);
    }

    if (firstName) {
      customer.firstName = firstName;
    }

    if (lastName) {
      customer.lastName = lastName;
    }

    // if have customer profile image, then destroy image before update new image
    if (req.imageFile && customer.profileImage) {
      const deleteRes = await destroy(customer.profileImagePublicId);
      console.log(deleteRes);
    }

    if (req.imageFile) {
      customer.profileImagePublicId = req.imageFile.public_id;
      customer.profileImage = req.imageFile.secure_url;
    }

    await customer.save();

    res.json({ message: 'Update profile success' });
  } catch (err) {
    next(err);
  }
};

/// test
// exports.searchByMenu = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { menuName } = req.params;
//     console.log('');
//     const menu = await Menu.findAll({
//       where: {
//         name: {
//           [Op.like]: `%${menuName}%`,
//         },
//       },
//       include: {
//         model: Restaurant,
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
// address
exports.createAddress = async (req, res, next) => {
  try {
    const {
      addressType,
      addressCustomer,
      addressGoogleMap,
      latitude,
      longitude,
      message,
    } = req.body;
    const customer = req.user;

    if (!customer) {
      createError('You are unauthorized.', 400);
    }

    if (!addressCustomer) {
      createError('Require customer address.', 400);
    }

    if (!latitude) {
      createError('Require latitude.', 400);
    }
    if (!longitude) {
      createError('Require longitude.', 400);
    }

    const address = await Address.create({
      addressType: addressType ? addressType : 'OTHER',
      addressCustomer,
      addressGoogleMap: addressGoogleMap ? addressGoogleMap : 'Not found',
      latitude,
      longitude,
      customerId: customer.id,
    });

    res.json({ message: 'Create address success.', address });
  } catch (err) {
    next(err);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id, {
      include: {
        model: Category,
        include: {
          model: Menu,
          include: {
            model: MenuOptionGroup,
            include: {
              model: MenuOption,
            },
          },
        },
      },
    });

    res.json({ restaurant });
  } catch (error) {
    next(error);
  }
};
exports.deleteAddress = async (req, res, next) => {
  try {
    const customer = req.user;
    const { addressId } = req.params;

    if (!customer) {
      createError('You are unauthorized.', 400);
    }

    const address = await Address.findOne({ where: { id: addressId } });

    if (!address) {
      createError('Cannot find this address', 400);
    }

    await address.destroy();

    res.json({
      message: 'Delete address success.',
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllCarts = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const customerId = req.user.id;
    const carts = await Order.findAll({
      where: {
        customerId,
        status: 'IN_CART',
      },
      include: {
        model: Restaurant,
      },
      transaction: t,
    });

    await t.commit();

    res.json({ carts });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const cart = await Order.findByPk(cartId, {
      include: {
        model: OrderMenu,
        include: {
          model: OrderMenuOptionGroup,
          include: {
            model: OrderMenuOption,
          },
        },
      },
    });

    if (!cart) createError('cart not found', 400);

    let cartSurface = await Order.findByPk(cartId);
    cartSurface = JSON.parse(JSON.stringify(cartSurface));

    const cartItems = await getFullCart(JSON.parse(JSON.stringify(cart)));

    res.json({ ...cartSurface, cartItems });
  } catch (err) {
    next(err);
  }
};

exports.getMenuById = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findByPk(menuId, {
      include: [
        {
          model: MenuOptionGroup,
          where: {
            status: 'ACTIVE',
          },
          required: false,
          include: {
            model: MenuOption,
            where: {
              status: 'ACTIVE',
            },
            required: false,
          },
        },
        {
          model: Restaurant,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });

    res.json({ menu });
  } catch (err) {
    next(err);
  }
};

module.exports.fillCart = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { orderId } = req.params;
    let cart = await Order.findByPk(orderId, {
      include: {
        model: OrderMenu,
        include: [
          {
            model: Menu,
          },
          {
            model: OrderMenuOptionGroup,
            include: [
              {
                model: MenuOptionGroup,
              },
              {
                model: OrderMenuOption,
                include: MenuOption,
              },
            ],
          },
        ],
      },
      where: {
        status: 'IN_CART',
      },
      transaction: t,
    });

    if (cart.status !== 'IN_CART') {
      createError("The entity you're trying to edit is not a cart");
    }
    for (let orderMenu of cart.OrderMenus) {
      const newMenuPrice = orderMenu.Menu.price;
      const newMenuName = orderMenu.Menu.name;
      const menuId = orderMenu.Menu.id;

      await OrderMenu.update(
        { name: newMenuName, price: newMenuPrice },
        {
          where: {
            menuId,
          },
          transaction: t,
        },
      );
      for (let orderMenuOptionGroup of orderMenu.OrderMenuOptionGroups) {
        const newGroupName = orderMenuOptionGroup.MenuOptionGroup.name;
        const groupId = orderMenuOptionGroup.MenuOptionGroup.id;
        await OrderMenuOptionGroup.update(
          { name: newGroupName },
          { where: { menuOptionGroupId: groupId }, transaction: t },
        );

        for (let orderMenuOption of orderMenuOptionGroup.OrderMenuOptions) {
          const newOptionName = orderMenuOption.MenuOption.name;
          const newOptionPrice = orderMenuOption.MenuOption.price;
          const optionId = orderMenuOption.MenuOption.id;
          console.log(newOptionPrice);
          await OrderMenuOption.update(
            { name: newOptionName, price: newOptionPrice },
            {
              where: {
                menuOptionId: optionId,
              },
              transaction: t,
            },
          );
        }
      }
    }

    cart = await Order.findByPk(orderId, {
      include: {
        model: OrderMenu,
        include: [
          {
            model: OrderMenuOptionGroup,
            include: [
              {
                model: OrderMenuOption,
              },
            ],
          },
        ],
      },
      transaction: t,
    });

    res.json({ cart });

    await t.commit();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.searchMenuInRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByPk(restaurantId, {
      include: {
        model: Menu,
        where: {
          status: 'ACTIVE',
        },
        required: false,
        include: {
          model: Menu,
          where: {
            status: 'ACTIVE',
          },
          required: false,
          include: {},
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
