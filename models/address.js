
module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        name: {
            type: DataTypes.STRING(2048),
            allowNull: false
        },
        detail: DataTypes.TEXT,
        latitude: {
            type: DataTypes.DECIMAL
        },
        longitude: {
            type: DataTypes.DECIMAL
        },

    });

    Address.associate = ({Customer}) => {
        Address.belongsTo(Customer, {
            foreignKey: {
                name: "addressId",
                allowNull: false,
                onDelete: "SETNULL",
                onUpdate: "SETNULL"
            }
        }) 
    }

    return Address
}