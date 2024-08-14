var express = require('express');
var router = express.Router();

const {sucess, fail} = require("../helpers/resposta")
const FoodService = require('../services/foodService')
const auth = require("../midware/auth")
const valid = require("../midware/validate")

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limite) || 10; // Limite padrão de 10
    const page = parseInt(req.query.pagina) || 1;   // Página padrão de 1

    FoodService.list(limit, page).then(foods => {
        if (foods)
            res.json(sucess(foods)) // Alterado de `book` para `foods`
        else
            res.status(500).json(fail("Parâmetros ultrapassados"))
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail("Falha ao mostrar as comidas"))
    });

});

router.get('/procurar', async (req, res) => {
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

router.post('/adicionar', auth.autorizationAdm, valid.validaFood, valid.validaPrice, async (req, res) => {
    const {name, price} = req.body

    let obj = await FoodService.save(name,price)
    if (obj)
        res.json(sucess(obj))
    else 
        res.status(500).json(fail("Falha a criar comida"))
})

router.put('/alterar/:id', auth.autorizationAdm, valid.validaFood, valid.validaPrice, async (req, res) => {
    const {id, name, type, price} = req.body

    let obj = await FoodService.getById(id)
   
    if(obj){
        obj = await FoodService.update(id,name,type,price)
        if (obj)
            res.json(sucess(obj))
        else 
            res.status(500).json(fail("Falha a alterar comida comida"))
    } else
        res.status(404).json(fail("Id da Comida não Encontrada"))
})

router.delete('/deletar/:id',auth.autorizationAdm, valid.validaFood, valid.validaPrice, async (req, res) => {
    const {id} = req.body

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