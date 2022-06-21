module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    Menu.associate = (models) => {
        Menu.belongsTo(models.Restaurant, {
            allowNull: false,
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
            foreignKey: {
                name: "restaurantId"
            }
        })

        // Menu { include: Category } NOT include : MenuCategory
        Menu.belongsToMany(models.Category, {
            through: models.MenuCategory,
            foreignKey: {
                name: "menuId"
            }
        })
    }
    return Menu
}