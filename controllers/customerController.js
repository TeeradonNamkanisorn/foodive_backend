const { menuList } = require('../services/getPrices');
const { Order, OrderMenu, sequelize, OrderMenuOption } = require('../models');
const {
  calculatePriceFromMenuList,
  getCartMenuArrayWithoutOptions,
} = require('../services/cartServices');
const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');
const { Address, Customer } = require('../models');
const address = require('../models/address');

module.exports.createCart = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { menus, restaurantId } = req.body;
    const example = [
      {
        id: 1,
        name: 'aaa',
        menuGroups: [
          {
            id: 2,
            name: 'abc',
            menuOptons: [{ id: 2, name: 'cde', menuOptionGroupId: 2 }],
          },
          { id: 2, name: 'ddd', menuOptionGroupId: 2 },
        ],
      },
    ];

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
      console.log(order.id);
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

    res.json({ cart });
    // await t.commit();
  } catch (err) {
    await t.rollback();
    next(err);
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

// address
exports.createAddress = async (req, res, next) => {
  try {
    const {
      addressType,
      addressCustomer,
      addressGoogleMap,
      latitude,
      longitude,
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
