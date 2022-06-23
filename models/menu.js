module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //base price; options' prices not included.
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
        },
        description: {
            type: DataTypes.TEXT,
        }
    })
    Menu.associate = ({Restaurant, Category, MenuCategory, MenuOptionGroup, OrderMenu}) => {
        Menu.belongsTo(Restaurant, {
            allowNull: false,
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
            foreignKey: {
                name: "restaurantId",
                allowNull: false
            }
        })


        // Menu { include: Category } NOT include : MenuCategory
        Menu.belongsToMany(Category, {
            through: MenuCategory,
            foreignKey: {
                name: "menuId"
            }
        })

        Menu.hasMany(MenuOptionGroup, {
            foreignKey: {
                name: "menuId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })

        Menu.hasMany(OrderMenu, {
            foreignKey: {
                name: "menuId",
                allowNull: false
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }
    return Menu
}