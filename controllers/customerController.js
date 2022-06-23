
const { menuList } = require("../services/getPrices");
const { Order, OrderMenu, sequelize, OrderMenuOption } = require('../models');
const { calculatePriceFromMenuList, getCartMenuArrayWithoutOptions} = require("../services/cartServices");




module.exports.createCart = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const {menus, restaurantId} = req.body;
        // menus = [
        //    {id: 123, price: 10, comment: "no sauces", menuOptions: [
        //     {id: 111, price: 1, name: "extra-large"}
        //    ]}
        // ]

        //IMPORTANT: NEEDS TO UPDATE PRICE EVERY TIME THE ORDER IS CHANGED. SIMPLY CALL CALCULATE PRICE FUNCTION; DO NOT SUBTRACT MANUALLY.
        const price = await calculatePriceFromMenuList(menus, restaurantId);
    

        const order = await Order.create({
            customerId: req.user.id,
            //driverId later when the restaurant confirms the order
            restaurantId,
            price
        }, {
            transaction : t
        });


        for (let menu of menus) {

            const order_menu = await OrderMenu.create({
                name: menu.name,
                price: menu.price,
                comment: menu.comment,
                orderId: order.id
            }, {
                transaction : t
            })

            for (let option of menu.menuOptions) {
                await OrderMenuOption.create({
                    name: option.name,
                    price: option.price,
                    orderMenuId:  order_menu.id
                }, {
                    transaction: t
                })
            }
        }
    
        const cart = await Order.findOne({where: {
            id: Order.id
        },
            include: {
                model: OrderMenu,
                include: {
                    model: OrderMenuOption
                },
                transaction: t
            }
        })
    
       await t.commit();
   
       res.json({cart})
    } catch (err) {
        await t.rollback();
        next(err)
    }
    
}