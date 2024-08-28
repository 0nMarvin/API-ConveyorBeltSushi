var express = require('express');
var router = express.Router();

const {sucess, fail} = require("../helpers/resposta")
const UserService = require('../services/userService')
const auth = require("../midware/auth")
const jwt = require('jsonwebtoken');

function generateToken(isAdmin, username) {
    const userPayload = {
        nome: username,
        grupo: isAdmin ? 'admin' : 'user'
    };

    const token = jwt.sign(userPayload, process.env.jwt, {
        expiresIn: '30m'
    });

    return token;
}

router.post('/login', async (req, res) => {
    // #swagger.tags = ['Login']
    const { user, senha } = req.body;

    if (!user || !senha) {
        return res.status(400).json(fail("Usuário e senha são obrigatórios"));
    }

    let resultado = await UserService.validatePassword(user, senha);

    if (resultado.valid) {
        const isAdminResult = await UserService.isUser(user);
        const token = generateToken(isAdminResult.isAdmin, user);
        res.json(sucess({ status: true, message: "Login realizado com sucesso", token: token }));
    } else {
        res.status(401).json(fail(resultado.message));
    }
});

router.post('/cadastro', auth.validaNome,auth.validaSenha, async (req, res) => {
    // #swagger.tags = ['Login']
    const {user, senha} = req.body

    let obj = await UserService.save(user, senha)
    if (obj)
        res.json(sucess(obj))
    else 
        res.status(500).json(fail("Falha ao salvar o novo usuário"))
})

router.post('/cadastro/adm',auth.autorizationAdm, auth.validaNome,auth.validaSenha, async (req, res) => {
    // #swagger.tags = ['Login']
    const {user, senha, adm} = req.body

    let obj
    if(adm == "true"){
         obj = await UserService.saveAdm(user, senha)
    }else{
         obj = await UserService.save(user, senha)
    }
    
    if (obj)
        res.json(sucess(obj))
    else 
        res.status(500).json(fail("Falha ao salvar o novo administrador"))
})

module.exports = router;