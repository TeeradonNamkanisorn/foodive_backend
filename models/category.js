module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //base price; options' prices not included.
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Category.associate = ({ Menu }) => {
    Category.hasMany(Menu, {
      allowNull: false,
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      foreignKey: {
        name: 'categoryId',
        // allowNull: false,
      },
    });
  };

  return Category;
};
