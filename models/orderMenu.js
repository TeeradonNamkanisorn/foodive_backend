module.exports = (sequelize, DataTypes) => {
    const OrderMenu = sequelize.define("OrderMenu", {
        Amount: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    });

    OrderMenu.associate = ({Order}) => {
        OrderMenu.belongsTo(Order, {
            foreignKey: {
                name: "orderId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }

    return OrderMenu
}