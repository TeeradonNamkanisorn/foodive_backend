module.exports = (sequelize, DataTypes) => {
  const OrderMenu = sequelize.define('OrderMenu', {
    price: {
      type: DataTypes.FLOAT,
    },
    name: {
      type: DataTypes.STRING,
    },
    comment: {
      // Validate length later
      type: DataTypes.TEXT,
      validate: {
        len: 50,
      },
    },
  });

  OrderMenu.associate = ({ Order, OrderMenuOptionGroup, Menu }) => {
    OrderMenu.belongsTo(Order, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderMenu.hasMany(OrderMenuOptionGroup, {
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
