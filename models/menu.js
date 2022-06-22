module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false
        },
        menuImage: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        // Used to delete cloudinary image when update or deleting
        menuImagePublicId: {
            type: DataTypes.STRING
        }
    })
    Menu.associate = (models) => {
        Menu.belongsTo(models.Restaurant, {
            allowNull: false,
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
            foreignKey: {
                name: "restaurantId",
                allowNull: false
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