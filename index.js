const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./docs/swagger_doc.json')

app.use("/docs",swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use("/install", require('./control/InstallAPI'))
app.use("/", require("./control/loginAPI"))
app.use("/", require('./control/UserAPI'))
app.use("/menu", require('./control/FoodApi'))
app.use("/pedido", require('./control/OrderAPI'))

app.listen(3000, () => {
    console.log("Listenning...")
})