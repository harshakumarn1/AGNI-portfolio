const express = require('express');
const app = express();
require('dotenv').config()

const ejs = require('ejs')

app.set("view engine", ejs)

app.listen(8080, () => {
    console.log("Server started")
})

app.use(express.static("public/css"))
app.use(express.static("public/js"))

app.get("/", (req, res) => {
    publicKey = process.env.PUBLIC_KEY
    templateId = process.env.TEMPLATE_ID
    serviceId = process.env.SERVICE_ID

    res.render("home.ejs",{publicKey, templateId, serviceId})  
})

app.get("/products", (req, res) => {
    res.render("products.ejs")  
})


