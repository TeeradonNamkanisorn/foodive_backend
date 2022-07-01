module.exports = (sequelize, DataTypes) => {
  const MenuOption = sequelize.define('MenuOption', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'DEACTIVATED'),
      defaultValue: 'ACTIVE',
    },
  });

  MenuOption.associate = ({ MenuOptionGroup, OrderMenuOption, OrderMenu }) => {
    MenuOption.belongsTo(MenuOptionGroup, {
      foreignKey: {
        name: 'menuOptionGroupId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    MenuOption.hasMany(OrderMenuOption, {
      foreignKey: {
        name: 'menuOptionId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };
  return MenuOption;
};
