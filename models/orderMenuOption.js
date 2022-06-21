module.exports = (sequelize, DataTypes) => {
    const OrderMenuOption = sequelize.define("OrderMenuOptions", {

    });

    OrderMenuOption.associate = ({MenuOption, OrderMenu}) => {
        OrderMenuOption.belongsTo(OrderMenu, {
            foreignKey: {
                name: "orderMenuId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        });

        OrderMenuOption.belongsTo(MenuOption, {
            foreignKey: {
                name: "menuOptionId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }

    return OrderMenuOption
}