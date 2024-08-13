const express = require("express")
const router = express.Router()
const sequelize = require("../helpers/bd")
const UserModel = require('../model/User')

router.get('/', async (req, res) => {
    await sequelize.sync({force: true})
    
    let userData = {
        user: process.env.user,
        senha: process.env.senha,
        isAdmin: true
    }
    
    try {
        const newUser = await UserModel.create(userData)
        res.json({status: true, user: newUser})
    } catch (error) {
        res.status(500).json({status: false, error: error.message})
    }
})

module.exports = router