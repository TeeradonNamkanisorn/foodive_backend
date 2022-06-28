module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //base price; options' prices not included.
    RestaurantID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Category.associate = ({ Menu }) => {
    Category.belongsTo(Menu, {
      allowNull: false,
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      foreignKey: {
        name: 'menuId',
        allowNull: false,
      },
    });
  };

  return Category;
};
