module.exports = (sequelize, DataTypes) => {
  const OrderMenuOption = sequelize.define('OrderMenuOption', {
    price: DataTypes.FLOAT,
    name: DataTypes.STRING,
  });

  OrderMenuOption.associate = ({ MenuOption, OrderMenuOptionGroup }) => {
    OrderMenuOption.belongsTo(OrderMenuOptionGroup, {
      foreignKey: {
        name: 'orderMenuOptionGroupId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderMenuOption.belongsTo(MenuOption, {
      foreignKey: {
        name: 'menuOptionId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return OrderMenuOption;
};
