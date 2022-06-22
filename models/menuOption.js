module.exports = (sequelize, DataTypes) => {
    const MenuOption = sequelize.define('MenuOption', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    })
   
    MenuOption.associate = ({Menu}) => {
        MenuOption.belongsTo(Menu, {
            foreignKey: {
                name: "menuId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }
    return MenuOption
}