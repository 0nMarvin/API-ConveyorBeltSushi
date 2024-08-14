const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

/*app.use("/books", require("./control/BookAPI"))
app.use("/authors", require("./control/AuthorAPI"))*/
app.use("/install", require('./control/InstallAPI'))
app.use("/", require("./control/loginAPI"))
app.use("/", require('./control/UserAPI'))
app.use("/menu", require('./control/FoodApi'))

app.listen(3000, () => {
    console.log("Listenning...")
})