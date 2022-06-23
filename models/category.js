module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Category.associate = ({ Menu, MenuCategory }) => {
    Category.belongsToMany(Menu, {
      through: MenuCategory,
      foreignKey: {
        name: 'categoryId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL',
    });
  };
  return Category;
};
