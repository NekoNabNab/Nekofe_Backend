const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")

const meja_app = require("./meja")
const menu_app = require("./menu")
const pegawai_app = require("./pegawai")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(meja_app)
app.use(menu_app)
app.use(pegawai_app)

app.listen(5000, () => {
    console.log("Server run on port 5000");
})




