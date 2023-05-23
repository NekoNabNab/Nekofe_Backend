const mysql = require("mysql")

//create sql connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ukl_aplikasikasir"
})

db.connect(error => {
    if (error) {
        console.log(error.message);
    }
    else {
        console.log("mySql Connected");
    }
})

module.exports = db