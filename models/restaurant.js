module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'close'),
      defaultValue: 'close',
      //   allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    //url
    image: {
      type: DataTypes.STRING,
    },
    imagePublicId: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.DECIMAL(18, 15),
    },
    longitude: {
      type: DataTypes.DECIMAL(18, 15),
    },
  });

  Restaurant.associate = ({ Menu, Order, Category }) => {
    Restaurant.hasMany(Menu, {
      allowNull: false,
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      foreignKey: {
        name: 'restaurantId',
      },
    });

    Restaurant.hasMany(Order, {
      foreignKey: {
        name: 'restaurantId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Restaurant.hasMany(Category, {
      foreignKey: {
        name: 'restaurantId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Restaurant;
};
