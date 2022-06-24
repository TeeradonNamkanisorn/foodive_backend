module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Tag.associate = ({ Menu, MenuTag }) => {
    Tag.belongsToMany(Menu, {
      through: MenuTag,
      foreignKey: {
        name: 'tagId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL',
    });
  };
  return Tag;
};
