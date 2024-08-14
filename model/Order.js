const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/bd.js");
const FoodModel = require("./Food.js");
const UserModel = require("./User.js");

const OrderModel = sequelize.define('Order', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dataHora: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW 
        },
        isOrder: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        isCook: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }
);

UserModel.belongsToMany(FoodModel, { through: OrderModel, foreignKey: 'userId' });
FoodModel.belongsToMany(UserModel, { through: OrderModel, foreignKey: 'foodId' });

module.exports = OrderModel;
