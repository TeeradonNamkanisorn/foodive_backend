module.exports = (sequelize, DataTypes) => {
    const Driver = sequelize.define('Driver', {
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
            unique: true
          },
          //password is not required for now because of possibility of google authetication
          password: DataTypes.STRING,
        
    }, {
        indexes:[
            //same as unique: true but less prone to a certain bug
              {unique:true, fields: ['email']
          }]
    })

    Driver.associate = ({Order}) => {
        Driver.hasMany(Order,  {
            foreignKey: {
                name: "orderId"
            },
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        })
    }

    return Driver
}