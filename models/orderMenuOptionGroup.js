module.exports = (sequelize, DataTypes) => {
  const OrderMenuOptionGroup = sequelize.define('OrderMenuOptionGroup', {
    // optional, for search optimization
    // orderMenuId: DataTypes.INTEGER,
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
