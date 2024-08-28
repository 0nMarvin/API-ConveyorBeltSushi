const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/bd.js");

const OrderModel = sequelize.define('Order', 
    {
        orderCodigo: {
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
        },
    }
);

const UserModel = require("./User");
const FoodModel = require("./Food");

UserModel.hasMany(OrderModel, { foreignKey: 'userId' });
FoodModel.hasMany(OrderModel, { foreignKey: 'foodId' });

OrderModel.belongsTo(UserModel, { foreignKey: 'userId' });
OrderModel.belongsTo(FoodModel, { foreignKey: 'foodId' });

module.exports = OrderModel;