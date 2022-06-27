const { Menu, MenuOption, MenuOptionGroup } = require('../models');
exports.calculatePriceFromMenuList = async (menus, restaurantId) => {
  const optionPrices = await menuList(restaurantId);
  const menuPrices = await menuOption(restaurantId);

  console.log(optionPrices, menuPrices);

  let totalPrice;

  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    totalPrice += menuPrices[menu.id];

    for (let j = 0; j < menus.menuOptions.length; j++) {
      const menuOption = menus[i].menuOptions[j];
      totalPrice += menus[i].menuOptions[j].price;
    }
  }
  return totalPrice;
};

exports.getCartMenuArrayWithoutOptions = async (menus) => {
  return menus.map((menu) => ({
    name: menu.name,
    price: menu.price,
    comment: menu.comment,
  }));
};

//Finding a key-value in an object is better than finding an index in an array.
const menuList = async () => {
  let menus = await Menu.findAll({});
  menus = JSON.parse(JSON.stringify(menus));
  const menusObj = {};
  // menus: [{id, price, name}]
  // { id: {id, price, name}}
  for (let menu of menus) {
    menusObj[menu.id] = menu;
  }
  return menusObj;
};

const optionList = async () => {
  let options = await MenuOption.findAll({});
  options = JSON.parse(JSON.stringify(options));
  const optionsObj = {};
  for (let option of options) {
    optionsObj[option.id] = option;
  }
  return optionsObj;
};

const optionGroupList = async () => {
  let menuOptionGroups = await MenuOptionGroup.findAll({});
  menuOptionGroups = JSON.parse(JSON.stringify(menuOptionGroups));

  const menuOptionGroupsObj = {};
  for (let menuOptionGroup of menuOptionGroups) {
    menuOptionGroupsObj[menuOptionGroup.id] = menuOptionGroup;
  }

  return menuOptionGroupsObj;
};
// exports.getCartMenuOptionsArray = async (menus, restaurantId)

//********* เขียนไว้เฉยๆยังไม่ได้ทดสอบ ************/
// const getDetailedCart = async (idOnlyList, restaurantId) => {
//     const optionPrices = await menuList(restaurantId);
//     const menuPrices = await menuOption(restaurantId);

//     const list = [];
//     for (let i = 0; i < idOnlyList.length; i++) {

//         const idOnlyMenu = idOnlyList[i];
//         const menu = {};

//         menu.price = menuPrices[currentMenu.id].price;
//         menu.name = menuPrices[currentMenu.id].name;
//         menu.menuOption = []

//         for (let j = 0; j < idOnlyMenu.menuOptions.length; j++) {
//             const idOnlyMenuOption = idOnlyMenu.menuOptions[j];
//             const menuOption = {}
//             menuOption.name = optionPrices[idOnlyMenuOption.id].name;
//             menuOption.id = optionPrices[idOnlyMenuOption.id].id;
//             menuOption.price = optionPrices[idOnlyMenuOption.id].price;

//             menu.menuOption.push(menuOption)
//         }

//         list.push(menu);
//     }

//     return list
// }

const getFullCart = async (menuIdsOnly, restaurantId) => {
  const allMenuList = await menuList();
  const allMenuOptionGroups = await optionGroupList();
  const allMenuOptions = await optionList();
  let totalPrice = 0;

  const full = menuIdsOnly.map((menuIdItem) => {
    totalPrice += +allMenuList[menuIdItem.menuId].price;
    return {
      name: allMenuList[menuIdItem.menuId].name,
      price: allMenuList[menuIdItem.menuId].price,
      optionGroups: menuIdItem.optionGroups.map((optionGroup) => {
        return {
          name: allMenuOptionGroups[optionGroup.menuOptionGroupId].name,
          options: optionGroup.options.map((option) => {
            totalPrice += +allMenuOptions[option.menuOptionId].price;
            return {
              name: allMenuOptions[option.menuOptionId].name,
              price: allMenuOptions[option.menuOptionId].price,
            };
          }),
        };
      }),
    };
  });

  return { cart: full, totalPrice };
};

module.exports = { getFullCart };

// const optionGroups1 = [
//   {
//     menuOptionGroupId: 1,
//     options: [
//       {
//         optionGroupId: 1,
//         menuOptionId: 1,
//       },
//       {
//         optionGroupId: 2,
//         menuOptionId: 3,
//       },
//     ],
//   },
//   {
//     menuOptionGroupId: 2,
//     options: [
//       {
//         optionGroupId: 2,
//         menuOptionId: 5,
//       },
//     ],
//   },
// ];

// const optionGroups2 = [
//   {
//     menuOptionGroupId: 3,
//     options: [
//       {
//         optionGroupId: 3,
//         menuOptionId: 7,
//       },
//     ],
//   },
// ];

// const menu = [
//   { menuId: 1, optionGroups: optionGroups1 },
//   { menuId: 2, optionGroups: optionGroups2 },
// ];

// getFullCart(menu).then((data) => console.log(data.totalPrice));
