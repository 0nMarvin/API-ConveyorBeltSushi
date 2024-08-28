const swaggerAutogen = require("swagger-autogen")()

output = './docs/swagger_doc.json' 
endpoints= ['./index.js']

const doc = {
    info: {
      version: '1.0.0',            // by default: '1.0.0'
      title: 'Sushi Belt',              // by default: 'REST API'
      description: 'Api que Simula o Funcionalmento de um Conveyor Belt Sushi Restaurant'         // by default: ''
    },
    tags: [                   // by default: empty Array
      {
        name: 'Login',             // Tag name
        description: 'Criação de Usuários e Login'       // Tag description
      },
      {
        name: 'User',             // Tag name
        description: 'Pesquisa, Exclusão, Modificação e Alteração de Usuários'       // Tag description
      },
      {
        name: 'Food',             // Tag name
        description: 'Criação, Pesquisa, Exclusão, Modificação e Alteração de Alimentos'       // Tag description
      },
      {
        name: 'Order',             // Tag name
        description: 'Criação, Pesquisa, Exclusão, Modificação e Alteração de Pedidos. Que é a tabela que junta Usuários e Comidas'       // Tag description
      },
      {
        name: 'BD',             // Tag name
        description: 'Instalação e População do Banco de Dados'       // Tag description
      },
      
    ],
  };

swaggerAutogen(output, endpoints, doc)