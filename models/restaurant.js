module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('Restaurant', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
          type: DataTypes.ENUM('open', 'close'),
          defaultValue: "close",
        //   allowNull: false,
  
        },
        email: {
          type: DataTypes.STRING,
          unique: true
        },
        password: DataTypes.STRING,
        //url
        restaurantIcon: {
          type: DataTypes.STRING
        },
        telephoneNumber: {
          type: DataTypes.STRING
        },
        latitude: {
            type: DataTypes.DECIMAL
        },
        longitude: {
            type: DataTypes.DECIMAL
        }
    })

    Restaurant.associate = ({Menu, Order}) => {
        Restaurant.hasMany(Menu, {
            allowNull: false,
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
            foreignKey: {
                name: "restaurantId"
            }
        })

        Restaurant.hasMany(Order,  {
            foreignKey: {
                name: "restaurantId"
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }

    return Restaurant
}