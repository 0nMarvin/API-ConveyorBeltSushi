const express = require("express")
const router = express.Router()
const sequelize = require("../helpers/bd")

const AuthorModel = require('../model/Author')
const BookModel = require('../model/Book')

router.get('/', async (req, res) => {
    await sequelize.sync({force: true})

    let autores = [
        "J. K. Rowling", "J. R. R. Tolkien", "Aldous Huxley", "George Orwell", "Clarice Lispector"
    ]
    let lautores = []
    for (let i = 0; i < autores.length; i++) {
        lautores.push(await AuthorModel.save(autores[i]))
    }

    let book1 = await BookModel.save("Harry Potter e a Pedra Filosofal", lautores[0].codigo, "Editora 1", 1997)
    let book2 = await BookModel.save("O Senhor dos Anéis", lautores[1], "Editora 2", 1950)
    let book3 = await BookModel.save("Admirável Mundo Novo", "Aldous Huxley", "Editora 1", 1932)

    llivros = [book1, book2, book3]
    res.json({status:true, autores: lautores, livros: llivros})
})

module.exports = router