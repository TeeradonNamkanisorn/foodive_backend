module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      name: DataTypes.STRING,
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        //not required may be due to google auth
        type: DataTypes.STRING,
      },
      gmail: {
        type: DataTypes.STRING,
      },
      password: DataTypes.STRING,
      profileImage: {
        type: DataTypes.STRING,
      },
      // for delete cloudinary image when update or deleting
      profileImagePublicId: {
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        //same as unique: true but less prone to a certain bug
        { unique: true, fields: ["email"] },
      ],
    }
  );

  Customer.associate = ({ Order, Address }) => {
    Customer.hasMany(Order, {
      foreignKey: {
        name: "customerId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Customer.hasMany(Address, {
      foreignKey: {
        name: "customerId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Customer;
};
