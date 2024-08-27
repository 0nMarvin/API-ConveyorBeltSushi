const OrderModel = require("../model/Order")
const UserModel = require("../model/User")
const FoodModel = require("../model/Food")
const RespostaHelper = require("../helpers/resposta")

module.exports = {
    list: async function(limit, page) {
        const offset = (page - 1) * limit;
        
        const orders = await OrderModel.findAll({
            limit: limit,
            offset: offset,
            include: [
                {
                    model: UserModel,
                    attributes: ['user'], 
                    through: { attributes: [] } // Exclui a tabela de junção da resposta
                },
                {
                    model: FoodModel,
                    attributes: ['nameFood'], 
                    through: { attributes: [] } // Exclui a tabela de junção da resposta
                }
            ]
        });

        return orders;
    },

    makeCook: async function(limit, page) {
        const offset = (page - 1) * limit;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera as horas para considerar apenas a data

        const pedidos = await OrderModel.findAll({
            where: {
                isOrder: true,
                dataHora: {
                    [Op.gte]: today, // Filtra apenas pedidos do dia atual
                }
            },
            limit: limit,
            offset: offset,
            order: [['dataHora', 'ASC']] // Prioriza pedidos mais antigos
        });

        if (pedidos.length > 0) {
            for (let pedido of pedidos) {
                pedido.isOrder = false;
                pedido.isCook = true;
                await pedido.save();
            }
        }

        return pedidos;
    },

    makeDone: async function(limit, page) {
        const offset = (page - 1) * limit;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera as horas para considerar apenas a data

        const pedidos = await OrderModel.findAll({
            where: {
                isCook: true,
                dataHora: {
                    [Op.gte]: today, // Filtra apenas pedidos do dia atual
                }
            },
            limit: limit,
            offset: offset,
            order: [['dataHora', 'ASC']] // Prioriza pedidos mais antigos
        });

        if (pedidos.length > 0) {
            for (let pedido of pedidos) {
                pedido.isCook = false;
                pedido.isDone = true;
                await pedido.save();
            }
        }

        return pedidos;
    },

    conta: async function(userId) {
        try {
            // 1. Buscar todos os pedidos do usuário que estão concluídos (isDone: true)
            const completedOrders = await OrderModel.findAll({
                where: {
                    userId: userId,
                    isDone: true
                }
            });
    
            // 1.1 Somar os preços dos pedidos concluídos
            const totalPrice = completedOrders.reduce((sum, order) => sum + order.price, 0);
    
            // 2. Buscar todos os pedidos em preparo (isCook: true OU isOrder: true)
            const preparingOrders = await OrderModel.findAll({
                where: {
                    userId: userId,
                    [Op.or]: [
                        { isCook: true },
                        { isOrder: true }
                    ]
                }
            });
    
            // 3. Atualizar pedidos concluídos (isDone: true) para isDone, isCook, e isOrder como false
            await OrderModel.update(
                { isDone: false, isCook: false, isOrder: false },
                { where: { userId: userId, isDone: true } }
            );
    
            // Retornar os resultados
            return {
                completedOrders: {
                    orders: completedOrders,
                    totalPrice: totalPrice
                },
                preparingOrders: preparingOrders
            };
            
        } catch (error) {
            console.error("Erro ao processar a conta do usuário:", error);
            throw new Error("Erro ao processar a conta do usuário.");
        }
    },
    
    save: async function(id, idcomida) {
        const newFood = await OrderModel.create({
            dataHora: new Date(), // Obtém a data e hora atual do sistema
            userId: id.codigo, // Certifique-se de passar o ID correto
            foodId: idcomida,

        });
        return newFood;
    },

    update: async function(codigo, idcomida) {
        return await OrderModel.update({foodId: idcomida}, {
            where: { orderCodigo: codigo }
        });
    },  
    
    preparando: async function(codigo) {
        return await OrderModel.update({isRoder: false, isCook: true, isDone: false}, {
            where: { orderCodigo: codigo }
        });
    }, 

    entregue: async function(codigo) {
        return await OrderModel.update({isRoder: false, isCook: false, isDone: true}, {
            where: { orderCodigo: codigo }
        });
    }, 

    fechar: async function(codigo) {
        return await OrderModel.update({isRoder: false, isCook: false, isDone: false}, {
            where: { orderCodigo: codigo }
        });
    }, 

    delete: async function(id) {
        return await OrderModel.destroy({where: { orderCodigo: id }})
    },

    getById: async function(id) {
        return await OrderModel.findByPk(id)
    },

    getByUserName: async function(username) {
        return await UserModel.findOne({
            where: {
                user: username.toUpperCase() 
            }
        });
    },

    verificaPedido: async function(codigo) {
        try {
            // Busca o pedido pelo ID
            const pedido = await OrderModel.findOne({
                where: { orderCodigo: codigo }
            });

            // Verifica se o pedido foi encontrado
            if (!pedido) {
                return RespostaHelper.fail("Pedido não encontrado");
            }

            // Retorna true se isOrder for true, e false se isOrder for false
            return pedido.isOrder ? RespostaHelper.sucess(true, "isOrder") : RespostaHelper.sucess(false, "isOrder");
        } catch (error) {
            // Tratamento de erro
            return RespostaHelper.fail("Erro ao verificar o pedido");
        }
    },
}