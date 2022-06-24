const { Tag, Customer, Restaurant, Driver, sequelize } = require('./models');

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
    phoneNumber: '0922798234',
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
    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

seed();
