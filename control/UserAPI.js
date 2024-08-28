var express = require('express');
var router = express.Router();

const {sucess, fail} = require("../helpers/resposta")
const UserService = require('../services/userService')
const auth = require("../midware/auth")
const valid = require("../midware/validate")

router.put('/', auth.autorization, valid.validaNome,valid.validaSenha, async (req, res) => {
    // #swagger.tags = ['User']
    const {user, senha} = req.body;

    const username = auth.userName(req);
    
    if (!username) {
        return res.status(403).json(fail("Token inválido ou não autorizado"));
    }

    let userRecord = await UserService.getByName(username);
    if (!userRecord) {
        return res.status(404).json(fail("Usuário não encontrado"));
    }

    let resultado = await UserService.update(userRecord.codigo, user, senha);

    if (resultado[0] > 0) // Verifica se alguma linha foi atualizada
        res.json(sucess(resultado));
    else
        res.status(500).json(fail("Usuário não encontrado ou nenhuma alteração feita"));
});

router.get('/adm/:id', auth.autorizationAdm, async (req, res) => {
    // #swagger.tags = ['User']
    try {
        let obj = await UserService.getById(req.params.id);
        if (obj) {
            res.status(200).json(obj);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/adm/:page?/:limit?', auth.autorizationAdm, async (req, res) => {
    // #swagger.tags = ['User']
    const page = parseInt(req.params.page) || 1; // Página padrão é 1
    const limit = parseInt(req.params.limit) || 10; // Limite padrão é 10

    try {
        const result = await UserService.listPaginated(page, limit);
        res.status(200).json(sucess(result));
    } catch (error) {
        res.status(500).json(fail('Internal server error'));
    }
});

router.delete('/adm/:id', auth.autorizationAdm, async (req, res) => {
    // #swagger.tags = ['User']
    // Obtém o ID do usuário a ser excluído
    const userId = req.params.id;

    // Primeiro, verifica se o usuário é um administrador
    let user = await UserService.getById(userId);

    if (!user) {
        return res.status(404).json(fail("Usuário não encontrado"));
    }

    if (user.isAdmin) {
        return res.status(403).json(fail("Usuário Administrador não pode ser excluído"));
    }

    // Realiza a exclusão do usuário
    let resultado = await UserService.delete(userId);

    if (resultado > 0) { // Verifica se alguma linha foi deletada
        res.json(sucess(resultado));
    } else {
        res.status(500).json(fail("Falha ao excluir o usuário"));
    }
})

router.put('/adm/:id',auth.autorizationAdm,valid.validaNome,valid.validaSenha, async (req, res) => {
    // #swagger.tags = ['User']
    //Fazer verificação se não é adm
    const id = req.params.id;
    const {user, senha, adm} = req.body
    
    let resultado;
    if(adm == "true"){
        resultado = await UserService.update(id, user, senha, true)
    }else{
        resultado = await UserService.update(id, user, senha)
    }

    if (resultado[0] > 0) // Verifica se alguma linha foi atualizada
        res.json(sucess(resultado))
    else
        res.status(500).json(fail("Usuário não encontrado ou nenhuma alteração feita"))
})

module.exports = router;