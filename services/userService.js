const {Op} = require("sequelize")
const UserModel = require('../model/User')

module.exports = {
    list: async function() {
        const users = await UserModel.findAll()
        return users
    },
    
    save: async function(username, senha) {
        const newUser = await UserModel.create({
            user: username,
            senha: senha
        })
        return newUser
    },

    saveAdm: async function(username, senha) {
        const newUser = await UserModel.create({
            user: username,
            senha: senha,
            isAdmin: true
        })
        return newUser
    },

    update: async function(id, username, senha) {
        return await UserModel.update({user: username, senha: senha}, {
            where: { codigo: id }
        })
    },

    update: async function(id, username, senha, adm) {
        return await UserModel.update({user: username, senha: senha,isAdmin: adm}, {
            where: { codigo: id }
        })
    },

    delete: async function(id) {
        return await UserModel.destroy({where: { codigo: id }})
    },

    getById: async function(id) {
        return await UserModel.findByPk(id)
    },

    getByName: async function(username) {
        return await UserModel.findOne({
            where: {
                user: username.toUpperCase() 
            }
        });
    },

    getName: async function(username) {
        return await UserModel.findOne({where: {user: {
            [Op.like]: '%' + username + '%'
        } }})
    },

    isUser: async function(username) {
        const result = await UserModel.findOne({
            where: {user: username},
            attributes: ['isAdmin']
        });
        
        if (result) {
            return {status: true, isAdmin: result.isAdmin};
        } else {
            return {status: false, message: 'Usuário não encontrado'};
        }
    },

    validatePassword: async function(username, senha) {
        const user = await UserModel.findOne({ where: { user: username } });
        if (!user) {
            return { valid: false, message: "Usuário não encontrado" };
        }
        
        // Comparação simples da senha fornecida com a senha armazenada
        if (user.senha !== senha) {
            return { valid: false, message: "Senha incorreta" };
        }

        return { valid: true, user };
    }
}