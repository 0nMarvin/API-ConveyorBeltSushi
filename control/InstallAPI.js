const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/bd");
const UserModel = require('../model/User');
const FoodModel = require('../model/Food');
const OrderModel = require('../model/Order');

router.get('/', async (req, res) => {
    try {
        await sequelize.sync({ force: true });

        // Criar um usuário inicial
        let userData = {
            user: process.env.user,
            senha: process.env.senha,
            isAdmin: true
        };
        const newUser = await UserModel.create(userData);

        // Adicionar alguns alimentos
        const foods = [
            { nameFood: 'Sushi de Salsicha', typeFood: 'Salgada', priceFood: 5.00 },
            { nameFood: 'Sushi de CreamChese', typeFood: 'Salgada', priceFood: 8.00 },
            { nameFood: 'Sushi com Doritos', typeFood: 'Salgada', priceFood: 8.00 },
            { nameFood: 'Ovo de Pasco de Sushi', typeFood: 'Doce', priceFood: 25.00 },
        ];
        
        await FoodModel.bulkCreate(foods);

        res.json({ status: true, user: newUser });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

module.exports = router;
