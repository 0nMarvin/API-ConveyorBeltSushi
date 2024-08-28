const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/bd");
const UserModel = require('../model/User');
const FoodModel = require('../model/Food');
const OrderModel = require('../model/Order');

router.get('/', async (req, res) => {
    try {
        await sequelize.sync({ force: true });

        // Criar um usuário administrador a partir das variáveis de ambiente
        let userData = {
            user: process.env.user,
            senha: process.env.senha,
            isAdmin: true
        };
        const adminUser = await UserModel.create(userData);

        // Criar 9 usuários comuns
        const users = [
            { user: 'usuario1', senha: 'senha1', isAdmin: false },
            { user: 'usuario2', senha: 'senha2', isAdmin: false },
            { user: 'usuario3', senha: 'senha3', isAdmin: false },
            { user: 'usuario4', senha: 'senha4', isAdmin: false },
            { user: 'usuario5', senha: 'senha5', isAdmin: false },
            { user: 'usuario6', senha: 'senha6', isAdmin: false },
            { user: 'usuario7', senha: 'senha7', isAdmin: false },
            { user: 'usuario8', senha: 'senha8', isAdmin: false },
            { user: 'usuario9', senha: 'senha9', isAdmin: false },
        ];
        const createdUsers = await UserModel.bulkCreate(users);

        // Adicionar alimentos absurdos culinários japoneses
        const foods = [
            { nameFood: 'Sushi de Salsicha', typeFood: 'Salgada', priceFood: 5.00 },
            { nameFood: 'Sushi de CreamChese', typeFood: 'Salgada', priceFood: 8.00 },
            { nameFood: 'Sushi com Doritos', typeFood: 'Salgada', priceFood: 8.00 },
            { nameFood: 'Ovo de Páscoa de Sushi', typeFood: 'Doce', priceFood: 25.00 },
            { nameFood: 'Sushi de Bacon', typeFood: 'Salgada', priceFood: 12.00 },
            { nameFood: 'Pizza Sushi', typeFood: 'Salgada', priceFood: 20.00 },
            { nameFood: 'Sushi de Morango com Chocolate', typeFood: 'Doce', priceFood: 15.00 },
            { nameFood: 'Sushi de Abacaxi', typeFood: 'Doce', priceFood: 10.00 },
            { nameFood: 'Sushi de Nutella', typeFood: 'Doce', priceFood: 18.00 },
            { nameFood: 'Sushi de Frango Frito', typeFood: 'Salgada', priceFood: 14.00 },
        ];
        const createdFoods = await FoodModel.bulkCreate(foods);

        // Criar 10 pedidos com diferentes estados
        const orders = [
            { userId: createdUsers[0].codigo, foodId: createdFoods[0].codigoFood, isOrder: true, isCook: false, isDone: false }, // Pedido em aberto
            { userId: createdUsers[1].codigo, foodId: createdFoods[1].codigoFood, isOrder: false, isCook: true, isDone: false }, // Pedido em preparação
            { userId: createdUsers[2].codigo, foodId: createdFoods[2].codigoFood, isOrder: false, isCook: true, isDone: false }, // Pedido em preparação
            { userId: createdUsers[3].codigo, foodId: createdFoods[3].codigoFood, isOrder: false, isCook: false, isDone: true }, // Pedido finalizado
            { userId: createdUsers[4].codigo, foodId: createdFoods[4].codigoFood, isOrder: false, isCook: false, isDone: true }, // Pedido finalizado
            { userId: createdUsers[5].codigo, foodId: createdFoods[5].codigoFood, isOrder: true, isCook: false, isDone: false }, // Pedido em aberto
            { userId: createdUsers[6].codigo, foodId: createdFoods[6].codigoFood, isOrder: false, isCook: true, isDone: false }, // Pedido em preparação
            { userId: createdUsers[7].codigo, foodId: createdFoods[7].codigoFood, isOrder: false, isCook: false, isDone: true }, // Pedido finalizado
            { userId: createdUsers[8].codigo, foodId: createdFoods[8].codigoFood, isOrder: false, isCook: true, isDone: false }, // Pedido em preparação
            { userId: createdUsers[0].codigo, foodId: createdFoods[9].codigoFood, isOrder: false, isCook: false, isDone: true }, // Pedido finalizado
        ];
        await OrderModel.bulkCreate(orders);

        res.json({ status: true, user: adminUser, message: "Tabelas populadas com sucesso!" });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

module.exports = router;
