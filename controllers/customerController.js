<<<<<<< HEAD
const { menuList } = require("../services/getPrices");
const { Order, OrderMenu, sequelize, OrderMenuOption } = require("../models");
const {
  calculatePriceFromMenuList,
  getCartMenuArrayWithoutOptions,
} = require("../services/cartServices");
const createError = require("../services/createError");
const { destroy } = require("../utils/cloudinary");
const { Customer } = require("../models");

// module.exports.createCart = async (req, res, next) => {
//     const t = await sequelize.transaction();
//     try {
//         const {menus, restaurantId} = req.body;
//         // menus = [
//         //    {id: 123, price: 10, comment: "no sauces", menuOptions: [
//         //     {id: 111, price: 1, name: "extra-large"}
//         //    ]}
//         // ]

//         //IMPORTANT: NEEDS TO UPDATE PRICE EVERY TIME THE ORDER IS CHANGED. SIMPLY CALL CALCULATE PRICE FUNCTION; DO NOT SUBTRACT MANUALLY.
//         const price = await calculatePriceFromMenuList(menus, restaurantId);

//         const order = await Order.create({
//             customerId: req.user.id,
//             //driverId later when the restaurant confirms the order
//             restaurantId,
//             price
//         }, {
//             transaction : t
//         });

//         for (let menu of menus) {

//             const order_menu = await OrderMenu.create({
//                 name: menu.name,
//                 price: menu.price,
//                 comment: menu.comment,
//                 orderId: order.id
//             }, {
//                 transaction : t
//             })

//             for (let option of menu.menuOptions) {
//                 await OrderMenuOption.create({
//                     name: option.name,
//                     price: option.price,
//                     orderMenuId:  order_menu.id
//                 }, {
//                     transaction: t
//                 })
//             }
//         }

//         const cart = await Order.findOne({where: {
//             id: Order.id
//         },
//             include: {
//                 model: OrderMenu,
//                 include: {
//                     model: OrderMenuOption
//                 },
//                 transaction: t
//             }
//         })

//        await t.commit();

//        res.json({cart})
//     } catch (err) {
//         await t.rollback();
//         next(err)
//     }

// }
=======
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
>>>>>>> bf52e7262c6ffef75df76f60b1698ba9b20d5426

//   get 1 customer who login
exports.getMe = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    const customer = await Customer.findByPk(user.id);
    res.json({ customer });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const { firstName, lastName } = req.body;
    const customer = req.user;
=======
    console.log('zero');
    const { firstName, lastName } = req.body;
    console.log('first');
    const customer = req.user;
    console.log('two');
    console.log(customer);
>>>>>>> bf52e7262c6ffef75df76f60b1698ba9b20d5426

    if (!customer) {
      createError('You are unauthorized', 400);
    }

    // check if not have any data to update
    if (Object.keys(req.body).length === 0 && !req.imageFile) {
      createError('You cannot update empty data', 400);
    }

<<<<<<< HEAD
    if (firstName) {
      customer.firstName = firstName;
    }

    if (lastName) {
      customer.lastName = lastName;
    }
=======
    customer.firstName = firstName;
    customer.lastName = lastName;
>>>>>>> bf52e7262c6ffef75df76f60b1698ba9b20d5426

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
