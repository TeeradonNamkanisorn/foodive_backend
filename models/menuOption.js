module.exports = (sequelize, DataTypes) => {
    const MenuOption = sequelize.define('MenuOption', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
   
    MenuOption.associate = ({Menu}) => {
        MenuOption.belongsTo(Menu, {
            foreignKey: {
                name: "menuId",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            }
        })
    }
    return MenuOption
}