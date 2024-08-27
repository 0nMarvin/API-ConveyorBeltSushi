const jwt = require('jsonwebtoken');
const UserService = require('../services/userService')
const FoodService = require("../services/foodService")
const OrderModel = require('../model/Order')

module.exports = {
    autorization: (req, res, next) => {
        let bearer = req.headers['authorization'] || "";
        bearer = bearer.split(" "); // Corrigido para split por espaço

        if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
            return res.status(403).json({ status: false, mensagem: "Token inválido" });
        }

        let token = bearer[1];
        jwt.verify(token,process.env.jwt, (err, obj) => {
            if (err) {
                return res.status(403).json({ status: false, mensagem: "Não autorizado" });
            }

            req.user = obj;
            next();
        });
    },

    autorizationAdm: (req, res, next) => {
        let bearer = req.headers['authorization'] || "";
        bearer = bearer.split(" "); // Corrigido para split por espaço

        if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
            return res.status(403).json({ status: false, mensagem: "Token inválido" });
        }

        let token = bearer[1];
        jwt.verify(token,process.env.jwt, (err, obj) => {
            if (err) {
                return res.status(403).json({ status: false, mensagem: "Não autorizado" });
            }

            if (obj.grupo !== 'admin') {
                return res.status(403).json({ status: false, mensagem: "Acesso restrito a administradores" });
            }

            req.user = obj;
            next();
        });
    },

    validaNome: async (req, res, next) => {
        let { user } = req.body;
        
        // Verifica se o nome foi informado
        if (!user || user.trim() === "") {
            return res.status(400).json({ status: false, error: "Nome não informado" });
        }
    
        // Verifica se o nome tem mais do que 5 caracteres
        if (user.length < 5) {
            return res.status(400).json({ status: false, error: "O nome precisa ter mais do que 5 caracteres" });
        }
    
        // Verifica se o nome de usuário já existe
        const existingUser = await UserService.getByName(user.toUpperCase());
        if (existingUser) {
            return res.status(400).json({ status: false, error: "Nome de usuário já existe" });
        }
    
        //Coloca o nome de usuário em caixa alta
        req.user = user.toUpperCase();
        next();
    },

    validaSenha: (req, res, next) => {
        let { senha } = req.body;
    
        // Verifica se a senha não é vazia
        if (!senha || senha.trim() === "") {
            return res.status(400).json({ status: false, error: "Senha não informada" });
        }
    
        // Verifica se a senha tem pelo menos 7 caracteres
        if (senha.length < 7) {
            return res.status(400).json({ status: false, error: "A senha precisa ter no mínimo 7 caracteres" });
        }
    
        // Verifica se a senha tem letras e números
        const hasLetters = /[a-zA-Z]/.test(senha);
        const hasNumbers = /\d/.test(senha);
        if (!hasLetters || !hasNumbers) {
            return res.status(400).json({ status: false, error: "A senha precisa ter letras e números." });
        }
    
        next();
    },

    validaIdComida: async function (req, res, next) {
        const { idComida } = req.body;
    
        try {
            // Verifique a existência da comida no banco de dados
            const comida = await FoodService.getById(idComida);
            if (!comida) {
                return res.status(404).json({ status: false, error: 'Comida não encontrada' });
            }
            next();
        } catch (error) {
            console.error('Erro ao validar ID da comida:', error);
            return res.status(500).json({ status: false, error: 'Erro ao validar a comida' });
        }
    },

    meuPedido: async function(req, res, next) {
        const { id } = req.params;

        try {
            // Extrair o nome do usuário a partir do token
            const username = module.exports.userName(req);
            if (!username) {
                return res.status(403).json({ status: false, error: 'Token inválido ou usuário não encontrado' });
            }

            // Buscar o usuário no banco de dados
            const user = await UserService.getByName(username);
            if (!user) {
                return res.status(403).json({ status: false, error: 'Usuário não encontrado' });
            }

            // Buscar o pedido no banco de dados
            const pedido = await OrderModel.findOne({
                where: {
                    orderCodigo: id, // Usando o nome correto da coluna
                    userId: user.codigo, // Usando o ID do usuário encontrado
                }
            });

            if (!pedido || pedido.isCook) {
                return res.status(403).json({ status: false, error: 'Você não tem permissão para modificar este pedido' });
            }

            next();
        } catch (error) {
            console.error('Erro ao validar pedido:', error);
            return res.status(500).json({ status: false, error: 'Erro ao validar o pedido' });
        }
    },
    

    userName: (req) => {
        let bearer = req.headers['authorization'] || "";
        bearer = bearer.split(" "); // Corrigido para split por espaço

        if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
            return null;
        }

        let token = bearer[1];
        try {
            let decoded = jwt.verify(token, process.env.jwt);
            return decoded.nome; // Supondo que o nome do usuário está armazenado em 'nome'
        } catch (err) {
            return null;
        }
    }
};
