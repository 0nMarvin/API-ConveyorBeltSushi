const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/bd");

const FoodModel = sequelize.define('Food', 
    {
        codigoFood: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nameFood: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typeFood: {
            type: DataTypes.STRING,
            allowNull: false
        },
        priceFood: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false
        }
    }
);

module.exports = FoodModel;
