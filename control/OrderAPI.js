var express = require('express');
var router = express.Router();

const {sucess, fail} = require("../helpers/resposta")
const OrderService = require("../services/orderService")
const auth = require("../midware/auth")

router.get('/', auth.autorizationAdm, async (req, res) => {
    const limit = parseInt(req.query.limite) || 10; // Limite padrão de 10
    const page = parseInt(req.query.pagina) || 1;   // Página padrão de 1

    try {
        const orders = await OrderService.list(limit, page);
        
        if (orders && orders.length > 0) {
            res.json(sucess(orders));
        } else {
            res.status(404).json(fail("Nenhum pedido encontrado"));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(fail("Falha ao listar os pedidos"));
    }
});

router.post('/', auth.autorization, auth.validaIdComida, async (req, res) => {
    const { idComida } = req.body;
    const username = auth.userName(req);

    if (!username) {
        return res.status(403).json(fail("Token inválido ou não autorizado"));
    }

    let userRecord = await OrderService.getByUserName(username);
    if (!userRecord) {
        return res.status(404).json(fail("Usuário não encontrado"));
    }

    let obj = await OrderService.save(userRecord, idComida);

    if (obj)
        res.json(sucess(obj));
    else 
        res.status(500).json(fail("Falha ao criar comida"));
});

router.put('/:id', auth.autorization, auth.validaIdComida, auth.meuPedido, async (req, res) => {
    const { idComida } = req.body;
    const orderCodigo = req.params.id;

    // Verifica se o pedido ainda está em preparo
    const verificaPedido = await OrderService.verificaPedido(orderCodigo);
    if (verificaPedido.status && !verificaPedido.isOrder) {
        return res.status(400).json(fail("Pedido não está mais em preparo, não há como modificá-lo"));
    }

    // Atualiza o pedido
    let obj = await OrderService.update(orderCodigo, idComida);

    if (obj) {
        res.json(sucess(obj));
    } else {
        res.status(404).json(fail("Id da Comida não Encontrada ou falha ao alterar o pedido"));
    }
});


router.delete('/:id', auth.autorization, auth.meuPedido, async (req, res) => {
    const orderCodigo = req.params.id;

    // Verifica se o pedido ainda está em preparo
    const verificaPedido = await OrderService.verificaPedido(orderCodigo);
    if (verificaPedido.status && !verificaPedido.isOrder) {
        return res.status(400).json(fail("Pedido não está mais em preparo, não há como deletá-lo"));
    }

    // Exclui o pedido
    let result = await OrderService.delete(orderCodigo);

    if (result) {
        res.json(sucess({message: "Pedido deletado com sucesso"}));
    } else {
        res.status(404).json(fail("Pedido não encontrado ou falha ao excluir o pedido"));
    }
});


router.put('/conta', auth.autorization, async (req, res) => {
    const username = auth.userName(req);

    if (!username) {
        return res.status(403).json(fail("Token inválido ou não autorizado"));
    }

    let userRecord = await OrderService.getByUserName(username);
    if (!userRecord) {
        return res.status(404).json(fail("Usuário não encontrado"));
    }

    try {
        const result = await OrderService.conta(userRecord);
        res.json(sucess(result));
    } catch (err) {
        console.log(err);
        res.status(500).json(fail("Falha ao processar a conta do usuário."));
    }
});

router.put('/cook', auth.autorizationAdm, async (req, res) => {
    const limit = parseInt(req.query.limite) || 10; // Limite padrão de 10
    const page = parseInt(req.query.pagina) || 1;   // Página padrão de 1

    try {
        // Chama o método makeCook para atualizar os pedidos
        const orders = await OrderService.makeCook(limit, page);
        
        if (orders && orders.length > 0) {
            res.json(sucess(orders));
        } else {
            res.status(404).json(fail("Nenhum pedido encontrado ou todos os pedidos já estão em preparo."));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(fail("Falha ao processar pedidos para preparo."));
    }  
});

router.put('/done', auth.autorizationAdm, async (req, res) => {
    const limit = parseInt(req.query.limite) || 10; // Limite padrão de 10
    const page = parseInt(req.query.pagina) || 1;   // Página padrão de 1

    try {
        // Chama o método makeDone para atualizar os pedidos
        const orders = await OrderService.makeDone(limit, page);
        
        if (orders && orders.length > 0) {
            res.json(sucess(orders));
        } else {
            res.status(404).json(fail("Nenhum pedido encontrado ou todos os pedidos já foram concluídos."));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(fail("Falha ao processar pedidos como concluídos."));
    }  
});



module.exports = router;