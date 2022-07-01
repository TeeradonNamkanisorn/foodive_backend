module.exports = (sequelize, DataTypes) => {
  const MenuTag = sequelize.define(
    'MenuTag',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      menuId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Tags',
          key: 'id',
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Menus',
          key: 'id',
        },
      },
      restaurantId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      indexes: [
        //same as unique: true but less prone to a certain bug
        { unique: true, fields: ['menuId', 'tagId'] },
      ],
    },
  );

  return MenuTag;
};
