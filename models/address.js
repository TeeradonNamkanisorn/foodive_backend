module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    addressType: {
      type: DataTypes.ENUM('HOME', 'WORK_PLACE', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    addressCustomer: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    addressGoogleMap: DataTypes.TEXT,

    latitude: {
      type: DataTypes.DECIMAL(18, 15),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(18, 15),
      allowNull: false,
    },
  });

  Address.associate = ({ Customer }) => {
    Address.belongsTo(Customer, {
      foreignKey: {
        name: 'customerId',
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
    });
  };

  return Address;
};
