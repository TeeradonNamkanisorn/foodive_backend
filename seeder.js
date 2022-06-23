const { Category } = require('./models');

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

// console.log(foodTags.map((tag) => ({ name: tag })));
Category.bulkCreate(foodTags.map((tag) => ({ name: tag })));
