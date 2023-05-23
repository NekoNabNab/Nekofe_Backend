const express = require("express")
const app = express()
const db = require("./db")

// Autentication dan Autoritation
const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("140533601726") // secret key, boleh diganti kok

//>>>>>>>>>>>>>>AUTENTICATION DAN AUTORIZATION<<<<<<<<<<<<<<<<<
validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token  = req.get("Token")
            
            // decrypt token menjadi nip
            let decryptToken = crypt.decrypt(token)

            // sql cek nip
            let sql = "select * from pegawai where ?"

            // set parameter
            let param = { nip: decryptToken}

            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                 // cek keberadaan nip
                if (result.length > 0) {
                    // nip tersedia
                    next()
                } else {
                    // jika user tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }

    }
}

// endpoint login user (authentication)
app.post("/pegawai/auth", (req, res) => {
    // tampung username dan password
    let param = [
        req.body.email, //username
        md5(req.body.password) // password
    ]
    

    // create sql query
    let sql = "select * from pegawai where email = ? and password = ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error

        // cek jumlah data hasil query
        if (result.length > 0) {
            // user tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].nip), // generate token
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid email/password"
            })
        }
    })
})


//<<<<<<<<<<<<<<<< API CRUD PEGAWAI >>>>>>>>>>>>>>>
//end-point akses data pegawai
app.get("/pegawai", validateToken(), (req, res) =>{

    let sql = "select * from pegawai"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                pegawai: result
            }

            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

//end-point untuk pencarian data pegawai
app.post("/pegawai/find", (req,res) => {
    let find = req.body.find
    let sql = "select * from pegawai where nip like '%"+find+"%' or nama like '%"+find+"%' or alamat like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                pegawai: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

//end point untuk insert data pegawai
app.post("/pegawai/add", (req,res) => {
    let data = {
        // nip: req.body.nip,
        role: req.body.role,
        nama: req.body.nama,
        alamat: req.body.alamat,
        email: req.body.email,
        password: md5(req.body.password)
    }
    let message = ""

    let sql = "insert into pegawai set ?"

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

    
})

//end point untuk update data pegawai
app.put("/pegawai/update", (req,res) => {
    let data = [{

        // nip: req.body.nip,
        role: req.body.role,
        nama: req.body.nama,
        alamat: req.body.alamat,
        email: req.body.email,
        password: md5(req.body.password)

    }, req.body.nip]

    let message = ""

    let sql = "update pegawai set ? where nip = ?"
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

//end point untuk hapus data pegawai
app.delete("/pegawai/:nip", (req,res) => {
    let data = {
        nip : req.params.nip
    }
    let message = ""
    let sql = "delete from pegawai where ?"
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