const {
  Tag,
  Customer,
  Restaurant,
  Driver,
  Menu,
  MenuOption,
  MenuOptionGroup,
  sequelize,
  MenuTag,
} = require('./models');

const foodTags = [
  'sweet',
  'salt',
  'spice',
  'european',
  'asian',
  'chinese',
  'sour',
  'cereal',
  'milk',
  'daily-product',
  'vegetable',
  'wine',
  'fruit',
];

//password: 111111
const customers = [
  {
    email: 'theme.2541@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'theme',
    lastName: 'namkanisorn',
    phoneNumber: '0922798232',
  },
  {
    email: 'johnDoe@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'john',
    lastName: 'doe',
    phoneNumber: '0922798233',
  },
  {
    email: 'bob@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'TN',
    lastName: 'bob',
    phoneNumber: '0922798234',
  },
  {
    email: 'cat@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'cat',
    lastName: 'catty',
    phoneNumber: '0922798235',
  },
];

const drivers = [
  {
    email: 'themeDriver2541@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'ThemeDriver',
    lastName: 'Driver',
    phoneNumber: '0922998800',
  },
  {
    email: 'Doggy@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'DoggyDriver',
    lastName: 'Driverrr',
    phoneNumber: '0822998039',
  },
  {
    email: 'Fox@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'foxy',
    lastName: 'squishy',
    phoneNumber: '0918009999',
  },
];

const restaurants = [
  {
    email: 'siamRestaurant@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    name: 'Siam Restaurant',
    phoneNumber: '0822225555',
    latitude: 100,
    longitude: 100,
  },
  {
    email: 'frenchRestaurant@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    name: 'French Restaurant',
    phoneNumber: '0822224444',
    latitude: 101,
    longitude: 100,
  },
  {
    email: 'chineseRestaurant@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    name: 'Chinese Restaurant',
    phoneNumber: '0822224444',
    latitude: 101,
    longitude: 101,
  },
];

const menus = [
  {
    name: 'pad thai',
    price: 10,
    menuImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Phat_Thai_kung_Chang_Khien_street_stall.jpg/1200px-Phat_Thai_kung_Chang_Khien_street_stall.jpg',
    menuImagePublicId: 'none',
    description: 'best thai food',
    restaurantId: 1,
  },
  {
    name: 'thai tea',
    price: 10,
    menuImage:
      'https://www.honestfoodtalks.com/wp-content/uploads/2021/11/iced-thai-tea-with-white-straw-1.jpg',
    menuImagePublicId: 'none',
    description: 'best thai food',
    restaurantId: 1,
  },
  {
    name: 'thai green curry',
    price: 12,
    menuImage:
      'https://www.recipetineats.com/wp-content/uploads/2019/02/Thai-Green-Curry_5.jpg',
    menuImagePublicId: 'none',
    description: 'tranditional thai food',
    restaurantId: 1,
  },
  {
    name: 'croissant',
    price: 5,
    menuImage:
      'https://img.freepik.com/free-photo/croissants-wooden-cutting-board_1150-28480.jpg?w=2000',
    menuImagePublicId: 'none',
    description: 'french croissant',
    restaurantId: 2,
  },
  {
    name: 'Andre',
    price: 10,
    menuImage:
      'https://img.restaurantguru.com/rf60-Andre-restaurant-seafood.jpg',
    menuImagePublicId: 'none',
    description: 'andre',
    restaurantId: 2,
  },
  {
    name: 'Flamiche',
    price: 15,
    menuImage:
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Tarte_Flamiche.jpg',
    menuImagePublicId: 'none',
    description: 'flamiche',
    restaurantId: 2,
  },
  {
    name: 'Peking Roasted Duck',
    price: 15,
    menuImage:
      'https://redhousespice.com/wp-content/uploads/2022/01/sliced-peking-duck-with-pancakes-scaled.jpg',
    menuImagePublicId: 'none',
    description: 'most well-known chinese cuisine',
    restaurantId: 3,
  },
  {
    name: 'Kung Pao Chicken',
    price: 15,
    menuImage:
      'https://cafedelites.com/wp-content/uploads/2018/04/Best-Kung-Pao-Chicken-IMAGE-2.jpg',
    description:
      'Kung Pao is made with chicken, vegetables, nuts, and Szechuan peppers. Szechuan: Szechuan cuisine typically uses Szechuan peppers, vegetables, mushrooms, herbs, pork, beef, rabbit, and yogurt.',
    menuImagePublicId: 'none',
    restaurantId: 3,
  },
  {
    name: 'Chineses Dumplings',
    price: 15,
    menuImage:
      'https://images-gmi-pmc.edge-generalmills.com/c1517889-0f2c-4de2-895a-69dbc16cd9d9.jpg',
    description: 'dumplings',
    menuImagePublicId: 'none',
    restaurantId: 3,
  },
];

const menuOptionGroups = [
  {
    name: 'size',
    numberLimit: 1,
    menuId: 1,
  },
  {
    name: 'flavor',
    numberLimit: 1,
    menuId: 1,
  },
  {
    name: 'size',
    numberLimit: 1,
    menuId: 2,
  },
  {
    name: 'flavor',
    numberLimit: 1,
    menuId: 2,
  },
];

const menuOptions = [
  {
    name: 'S',
    price: 0,
    menuOptionGroupId: 1,
  },
  {
    name: 'M',
    price: 1,
    menuOptionGroupId: 1,
  },
  {
    name: 'L',
    price: 3,
    menuOptionGroupId: 1,
  },
  {
    name: 'sweet',
    price: 0,
    menuOptionGroupId: 2,
  },
  {
    name: 'salt',
    price: 0,
    menuOptionGroupId: 2,
  },
  {
    name: 'S',
    price: 0,
    menuOptionGroupId: 3,
  },
  {
    name: 'M',
    price: 1,
    menuOptionGroupId: 3,
  },
  {
    name: 'L',
    price: 3,
    menuOptionGroupId: 3,
  },
  {
    name: 'sweet',
    price: 0,
    menuOptionGroupId: 4,
  },
  {
    name: 'salt',
    price: 0,
    menuOptionGroupId: 4,
  },
];

const menuTags = [
  {
    menuId: 1,
    tagId: 1,
  },
  {
    menuId: 1,
    tagId: 2,
  },
  {
    menuId: 2,
    tagId: 1,
  },
  {
    menuId: 2,
    tagId: 2,
  },
];

const seed = async () => {
  const t = await sequelize.transaction();
  try {
    await Customer.bulkCreate(customers, { transaction: t });
    await Restaurant.bulkCreate(restaurants, { transaction: t });
    await Driver.bulkCreate(drivers, { transaction: t });
    await Tag.bulkCreate(
      foodTags.map((tag) => ({ name: tag })),
      { transaction: t },
    );
    await Menu.bulkCreate(menus, { transaction: t });
    await MenuOptionGroup.bulkCreate(menuOptionGroups, { transaction: t });
    await MenuOption.bulkCreate(menuOptions, { transaction: t });
    await MenuTag.bulkCreate(menuTags, { transaction: t });
    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

seed();