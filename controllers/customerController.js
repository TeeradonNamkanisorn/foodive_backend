
const { menuList } = require("../services/getPrices");
const { Order, OrderMenu, sequelize, OrderMenuOption } = require('../models');
const { calculatePriceFromMenuList, getCartMenuArrayWithoutOptions} = require("../services/cartServices");
const createError = require("../services/createError");
const { destroy } = require("../utils/cloudinary");



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
    console.log("zero");
    const { firstName, lastName } = req.body;
    console.log("first");
    const customer = req.user;
    console.log("two");
    console.log(customer);

    if (!customer) {
      createError("You are unauthorized", 400);
    }

    // check if not have any data to update
    if (Object.keys(req.body).length === 0 && !req.imageFile) {
      createError("You cannot update empty data", 400);
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

    res.json({ message: "Update profile success" });
  } catch (err) {
    next(err);
  }
};
