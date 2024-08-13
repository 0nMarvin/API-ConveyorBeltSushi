const jwt = require('jsonwebtoken');
const UserService = require('../services/userService')

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
