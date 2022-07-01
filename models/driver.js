module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define(
    'Driver',
    {
      firstName: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: {
            args: ['^(0[689]{1})+([0-9]{8})+$', 'g'],
            msg: 'Phone number format is incorrect',
          },
        },
      },
      //password is not required for now because of possibility of google authetication
      password: DataTypes.STRING,
      driverImage: DataTypes.STRING,
      driverImagePublicId: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE'),
        default: 'UNAVAILABLE',
      },
      latitude: {
        type: DataTypes.DECIMAL(18, 15),
      },
      longitude: {
        type: DataTypes.DECIMAL(18, 15),
      },
    },
    {
      indexes: [
        //same as unique: true but less prone to a certain bug
        { unique: true, fields: ['email'] },
      ],
    },
  );

  Driver.associate = ({ Order }) => {
    Driver.hasMany(Order, {
      foreignKey: {
        name: 'driverId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Driver;
};
//
