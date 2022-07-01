module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    price: {
      //Includes delivery fee as well?
      type: DataTypes.FLOAT,
      //Price is only calculated when the order is accepted hence, it can be null.
    },
    deliveryFee: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    distance: {
      //KM
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.ENUM(
        'IN_CART',
        'RESTAURANT_PENDING',
        'DELIVERY_PENDING',
        'DELIVERED',
      ),
      defaultValue: 'IN_CART',
    },
    customerLatitude: {
      type: DataTypes.DECIMAL(18, 15),
    },
    customerLongitude: {
      type: DataTypes.DECIMAL(18, 15),
    },
    addressName: {
      type: DataTypes.STRING,
    },
  });

  //Restaurant FK may be removed later but we'll see.
  Order.associate = ({ Restaurant, Customer, Driver, OrderMenu }) => {
    Order.belongsTo(Customer, {
      foreignKey: {
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Order.belongsTo(Driver, {
      foreignKey: {
        name: 'driverId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Order.belongsTo(Restaurant, {
      foreignKey: {
        name: 'restaurantId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Order.hasMany(OrderMenu, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Order;
};

//

//{id: {productId: id, price}}
