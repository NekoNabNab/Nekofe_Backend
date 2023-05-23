const express = require("express")
const app = express()
const db = require("./db")

const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file

const moment = require("moment")

// Upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage: storage})


//<<<<<<<<<<<<<<<< API CRUD MENU >>>>>>>>>>>>>>>
//end-point akses data menu
app.get("/menu", validateToken(), (req, res) =>{

    let sql = "select * from menu"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                menu: result
            }

            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

//end-point untuk pencarian data menu
app.post("/menu/find", (req,res) => {
    let find = req.body.find
    let sql = "select * from menu where jenis like '%"+find+"%' or nama like '%"+find+"%' or id like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                menu: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

//end point untuk insert data menu
app.post("/menu/add", upload.single("image"), (req,res) => {
    let data = {
        // id: req.body.id,
        nama: req.body.nama,
        jenis: req.body.jenis,
        harga: req.body.harga,
        image: req.file.filename,
        desc: req.body.desc
    }
    let message = ""

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into menu set ?"

        db.query(sql, data, (err,result) => {
            if (err) {
                message = err.message
            } else {
                message = result.affectedRows + " data telah ditambahkan"
            }

            let response = {
                message : message
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        })
    }
})

//end point untuk update data menu
app.put("/menu/update", (req,res) => {
    let data = [{

    // id: req.body.id,
    nama: req.body.nama,
    jenis: req.body.jenis,
    harga: req.body.harga,
    // gambar: req.body.gambar,
    desc: req.body.desc

    }, req.body.id]

    let message = ""

    let sql = "update menu set ? where id = ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " data telah diubah"
        }

        let response = {
            message : message
        }
    
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })

    
})

//end point untuk hapus data menu
app.delete("/menu/:id", (req,res) => {
    let data = {
        id : req.params.id
    }
    let message = ""
    let sql = "delete from menu where ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " data telah dihapus"
        }

        let response = {
            message : message
        }
    
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })

    
})

module.exports=app;