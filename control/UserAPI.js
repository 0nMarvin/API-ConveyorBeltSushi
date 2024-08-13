var express = require('express');
var router = express.Router();

const {sucess, fail} = require("../helpers/resposta")
const UserService = require('../services/userService')
const auth = require("../midware/auth")

router.post('/alterar', auth.autorization, auth.validaNome,auth.validaSenha, async (req, res) => {
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

router.get('/adm/:id', auth.autorizationAdm,async(req,res) =>{
    let obj = await UserService.getByName(req.params.id)
})

router.delete('/adm/excluir/:id', auth.autorizationAdm, async (req, res) => {
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

router.post('/adm/alterar',auth.autorizationAdm,auth.validaNome,auth.validaSenha, async (req, res) => {
    //Fazer verificação se não é adm
    const {id, user, senha, adm} = req.body

    if(adm == 1){
        let resultado = await UserService.update(id, user, senha, true)
    }else{
        let resultado = await UserService.update(id, user, senha)
    }

    if (resultado[0] > 0) // Verifica se alguma linha foi atualizada
        res.json(sucess(resultado))
    else
        res.status(500).json(fail("Usuário não encontrado ou nenhuma alteração feita"))
})

module.exports = router;