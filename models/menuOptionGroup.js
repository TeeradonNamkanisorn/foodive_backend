module.exports = (sequelize, DataTypes) => {
    const MenuOptionGroup = sequelize.define("MenuOptionGroup", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numberLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    });

    MenuOptionGroup.associate = ({Menu, MenuOption}) => {
        MenuOptionGroup.belongsTo(Menu, {
            foreignKey: {
                name: "menuId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        });
        MenuOptionGroup.hasMany(MenuOption, {
            foreignKey: {
                name: "menuOptionGroupId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }

    return MenuOptionGroup

}