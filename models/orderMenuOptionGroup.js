module.exports = (sequelize, DataTypes) => {
  const OrderMenuOptionGroup = sequelize.define('OrderMenuOptionGroup', {
    name: DataTypes.STRING,
  });

  OrderMenuOptionGroup.associate = ({
    OrderMenuOption,
    MenuOptionGroup,
    OrderMenu,
  }) => {
    OrderMenuOptionGroup.belongsTo(OrderMenu, {
      foreignKey: {
        name: 'orderMenuId',
        allowNull: 'false',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderMenuOptionGroup.hasMany(OrderMenuOption, {
      foreignKey: {
        name: 'orderMenuOptionGroupId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderMenuOptionGroup.belongsTo(MenuOptionGroup, {
      foreignKey: {
        name: 'menuOptionGroupId',
        allowNull: 'false',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return OrderMenuOptionGroup;
};
