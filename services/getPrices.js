const { Menu, MenuOption } = require('../models');

const menuList = async (restaurantId) => {
     let menuPrices = await Menu.findAll({
          where: {
               restaurantId,
          },
          attributes: ['id', 'name', 'price'],
     });
     //[{id, name, price}, {id, name, price}, {id,name, price}]
     //transforms to {id1: {id1, name, price}, id2: {id2, name, price}}
     menuPrices = JSON.parse(JSON.stringify(menuPrices));
     menuPrices = menuPrices.reduce((acc, cur) => {
          acc.id = { name: cur.name, price: cur.price, id: cur.id };
          return cur;
     }, {});

     return menuPrices;
};

const menuOption = async (restaurantId) => {
     let optionPrices = await MenuOption.findAll({
          where: {
               restaurantId,
          },
          attributes: ['id', 'name', 'price'],
     });

     optionPrices = JSON.parse(JSON.stringify(optionPrices));
     optionPrices = optionPrices.reduce((acc, cur) => {
          acc.id = { name: cur.name, price: cur.price, id: cur.id };
          return cur;
     }, {});

     return optionPrices;
};

module.exports = { menuList, menuOption };
