module.exports = (sequelize, DataTypes) => {
    const MenuCategory = sequelize.define('MenuCategory', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        menuId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Categories",
                key: "id"
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Menus", 
                key: "id"
            }
        }
    });

   

    return MenuCategory
}