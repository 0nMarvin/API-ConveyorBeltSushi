const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/bd.js");
const FoodModel = require("./Food.js");
const UserModel = require("./User.js");

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
        // userId e foodId serão adicionados automaticamente como parte das associações
    }
);

// Definição das associações sem restrição de unicidade
UserModel.hasMany(OrderModel, { foreignKey: 'userId' });
FoodModel.hasMany(OrderModel, { foreignKey: 'foodId' });

OrderModel.belongsTo(UserModel, { foreignKey: 'userId' });
OrderModel.belongsTo(FoodModel, { foreignKey: 'foodId' });

module.exports = OrderModel;
