module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //base price; options' prices not included.
    // restaurantId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  });

  Category.associate = ({ Menu, Restaurant }) => {
    Category.hasMany(Menu, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      foreignKey: {
        name: 'categoryId',
        // allowNull: false,
      },
    });
    Category.belongsTo(Restaurant, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      foreignKey: {
        name: 'restaurantId',
        // allowNull: false,
      },
    });
  };

  return Category;
};
