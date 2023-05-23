const express = require("express")
const app = express()
const db = require("./db")

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
//<<<<<<<<<<<<<<<< API CRUD NO MEJA >>>>>>>>>>>>>>>
//end-point akses data meja
app.get("/meja", validateToken(), (req, res) =>{

    let sql = "select * from meja"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                meja: result
            }

            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

//end-point untuk pencarian data meja
app.post("/menu/find", (req,res) => {
    let find = req.body.find
    let sql = "select * from meja where id like '%"+find+"%' or nomor like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                meja: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

//end point untuk insert data meja
app.post("/meja/add", (req,res) => {
    let data = {
        // id: req.body.id,
        nomor: req.body.nomor
    }
    let message = ""

    let sql = "insert into meja set ?"

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

//end point untuk update data meja
app.put("/meja/update", (req,res) => {
    let data = [{

    // id: req.body.id,
    nomor: req.body.nomor,

    }, req.body.id]

    let message = ""

    let sql = "update meja set ? where id = ?"
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

//end point untuk hapus data meja
app.delete("/meja/:id", (req,res) => {
    let data = {
        id : req.params.id
    }
    let message = ""
    let sql = "delete from meja where ?"
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