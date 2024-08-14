const {Op} = require("sequelize")
const FoodModel = require("../model/Food.js")

module.exports = {
    list: async function(limit, page) {
        const offset = (page - 1) * limit;
        const foods = await FoodModel.findAll({
            limit: limit,
            offset: offset
        });
        return foods;
    },

    search: async function(limit, page, category) {
        const offset = (page - 1) * limit;
        
        const whereClause = category ? { typeFood: category } : {}; // Filtra por categoria se fornecida
        
        const foods = await FoodModel.findAll({
            limit: limit,
            offset: offset,
            where: whereClause
        });
        
        return foods;
    },
    
    save: async function(name, type, price) {
        const newFood = await FoodModel.create({
            nameFood: name,
            priceFood: price,
            typeFood: type
        })
        return newFood
    },

    update: async function(id, name, type, price) {
        return await FoodModel.update({nameFood: name, typeFood: type, priceFood: price}, {
            where: { codigo: id }
        })
    },

    update: async function(id, name) {
        return await FoodModel.update({nameFood: name}, {
            where: { codigo: id }
        })
    },

    delete: async function(id) {
        return await FoodModel.destroy({where: { codigoFood: id }})
    },

    getById: async function(id) {
        return await FoodModel.findByPk(id)
    },

    getByName: async function(name) {
        return await FoodModel.findOne({
            where: {
                nameFood: name.toUpperCase() 
            }
        });
    }
}