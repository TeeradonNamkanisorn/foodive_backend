const { menuList } = require('../services/getPrices');
const { Order, OrderMenu, sequelize, OrderMenuOption } = require('../models');
const {
  calculatePriceFromMenuList,
  getCartMenuArrayWithoutOptions,
} = require('../services/cartServices');
const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');

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
        for (let option of optionGroup.options) {
          await OrderMenuOption.create(
            {
              orderMenuId: orderMenu.id,
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
          model: OrderMenuOption,
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
      for (let option of optionGroup.options) {
        await OrderMenuOption.create(
          {
            orderMenuId: orderMenu.id,
            menuOptionId: option.id,
          },
          { transaction: t },
        );
      }
    }

    const cart = await Order.findByPk(orderId);

    res.json({ message: 'successfully added menu to cart!' });
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
    console.log('zero');
    const { firstName, lastName } = req.body;
    console.log('first');
    const customer = req.user;
    console.log('two');
    console.log(customer);

    if (!customer) {
      createError('You are unauthorized', 400);
    }

    // check if not have any data to update
    if (Object.keys(req.body).length === 0 && !req.imageFile) {
      createError('You cannot update empty data', 400);
    }

    customer.firstName = firstName;
    customer.lastName = lastName;

    // if have customer profile image, then destroy image before update new image
    if (req.imageFile && customer.profileImage) {
      const deleteRes = await destroy(customer.profileImage);
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
