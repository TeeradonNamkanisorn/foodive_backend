module.exports = (sequelize, DataTypes) => {
  const OrderMenu = sequelize.define('OrderMenu', {
    price: {
      type: DataTypes.FLOAT,
    },
    name: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  });

  OrderMenu.associate = ({ Order, OrderMenuOption, Menu }) => {
    OrderMenu.belongsTo(Order, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderMenu.hasMany(OrderMenuOption, {
      foreignKey: {
        name: 'orderMenuId',
        // allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderMenu.belongsTo(Menu, {
      foreignKey: {
        name: 'menuId',
        // allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return OrderMenu;
};
