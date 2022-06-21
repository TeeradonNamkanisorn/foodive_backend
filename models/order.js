
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        price: {
            //Includes delivery fee as well?
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        deliveryFee: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        distance: {
            //KM
            type: DataTypes.FLOAT
        },
        status: {
            type: DataTypes.ENUM("IN_CART", "RESTAURANT_PENDING", "DELIVERY_PENDING", "DELIVERED"),
            defaultValue: "IN_CART"
        }
    })

    //Restaurant FK may be removed later but we'll see.
    Order.associate = ({Restaurant, Customer, Driver, OrderMenu}) => {
        Order.belongsTo(Customer, {
            foreignKey: {
                name: "customerId"
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        });

        Order.belongsTo(Driver, {
            foreignKey: {
                name: "driverId"
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })

        Order.belongsTo(Restaurant, {
            foreignKey: {
                name: "restaurantId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })

        Order.hasMany(OrderMenu, {
            foreignKey: {
                name: "orderId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }

    return Order
    
}