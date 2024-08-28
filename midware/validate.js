const jwt = require('jsonwebtoken');
const UserService = require('../services/userService')
const FoodService = require('../services/foodService')

module.exports = {
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
    },

    validaFood: async (req, res, next) => {
        let { name } = req.body;
        
        // Verifica se o nome foi informado
        if (!name || name.trim() === "") {
            return res.status(400).json({ status: false, error: "Nome não informado" });
        }
    
        // Verifica se o nome já existe
        const existingUser = await FoodService.getByName(name);
        if (existingUser) {
            return res.status(400).json({ status: false, error: "Comida já cadastrada" });
        }
        next();
    },

    validaPrice: async (req, res, next) => {
        let { price } = req.body;
        
        // Verifica se o preço foi informado
        if (!price || price.trim() === "") {
            return res.status(400).json({ status: false, error: "Preço não informado" });
        }
    
        // Verifica se o preço é um número válido com até duas casas decimais
        const pricePattern = /^\d+(\.\d{1,2})?$/;
        if (!pricePattern.test(price)) {
            return res.status(400).json({ status: false, error: "Preço inválido. Deve ser um número com até duas casas decimais." });
        }
        
        next();
    },
};
