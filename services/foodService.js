const {Op} = require("sequelize")
const FoodModel = require("../model/Food.js")

module.exports = {
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
        const result = await FoodModel.update(
            {
                nameFood: name,
                typeFood: type,
                priceFood: price
            },
            {
                where: { codigoFood: id }  
            }
        );
        
        // Retorna o objeto atualizado, se a operação foi bem-sucedida
        if (result[0] > 0) {
            return await FoodModel.findByPk(id);
        } else {
            return null; // Caso nenhuma linha tenha sido atualizada
        }
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