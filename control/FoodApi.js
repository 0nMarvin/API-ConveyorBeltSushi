var express = require('express');
var router = express.Router();

const {sucess, fail} = require("../helpers/resposta")
const FoodService = require('../services/foodService')
const auth = require("../midware/auth")
const valid = require("../midware/validate")

router.get('/', async (req, res) => {
    // #swagger.tags = ['Food']
    const limit = parseInt(req.query.limite) || 10; // Limite padrão de 10
    const page = parseInt(req.query.pagina) || 1;   // Página padrão de 1
    const category = req.query.categoria || '';     // Categoria padrão vazia

    FoodService.search(limit, page, category).then(foods => {
        if (foods)
            res.json(sucess(foods))
        else
            res.status(500).json(fail("Parâmetros ultrapassados"))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao mostrar as comidas"))
    });
});

router.post('/', auth.autorizationAdm, valid.validaFood, valid.validaPrice, async (req, res) => {
    // #swagger.tags = ['Food']
    const { name, type, price } = req.body;  // Inclua 'type' (categoria) no corpo da requisição

    let obj = await FoodService.save(name, type, price);  // Passe 'type' para o serviço
    if (obj)
        res.json(sucess(obj));
    else 
        res.status(500).json(fail("Falha ao criar comida"));
})

router.put('/:id', auth.autorizationAdm, valid.validaFood, valid.validaPrice, async (req, res) => {
    // #swagger.tags = ['Food']
    const { name, type, price } = req.body;
    const { id } = req.params;

    let obj = await FoodService.getById(id);
   
    if (obj) {
        obj = await FoodService.update(id, name, type, price);
        if (obj)
            res.json(sucess(obj));
        else 
            res.status(500).json(fail("Falha ao alterar a comida"));
    } else {
        res.status(404).json(fail("Id da Comida não encontrada"));
    }
});

router.delete('/:id',auth.autorizationAdm, async (req, res) => {
    // #swagger.tags = ['Food']
    const {id} = req.params;

    let obj = await FoodService.getById(id)
   
    if(obj){
        obj = await FoodService.delete(id)
        if (obj)
            res.json(sucess(obj))
        else 
            res.status(500).json(fail("Falha a excluir a comida"))
    } else
        res.status(404).json(fail("Id da Comida não Encontrada"))

})

module.exports = router;