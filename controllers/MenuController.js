// import model
import Menu from "../models/MenuModel.js";
import User from "../models/UserModel.js";

// library upload file
import path from "path"; 
import fs from "fs";


// controller get data menu
export const getMenu = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data menu
            response = await Menu.findAll({
                attributes:['uuid','nama_menu','harga','jenis','gambar'],
                include:[{
                    model: User,
                    attributes:['nama_user','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller search data menu by id
export const getMenuById = async(req, res) =>{
    try {
        const menu = await Menu.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!menu) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin", "manajer", "kasir"){
            response = await Menu.findOne({
                attributes:['uuid','nama_menu','harga','jenis','gambar'],
                where:{
                    id: menu.id
                },
                include:[{
                    model: User,
                    attributes:['nama_user','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller search data transaksi by id user
export const getMenuByJenis = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await Menu
            .findAll({
                where: { jenis: req.params.jenis },
                attributes:['uuid','nama_menu','harga','jenis','gambar'],
                include:[
                    {
                        model: User,
                        attributes:['nama_user','email']
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller search data transaksi by id user
export const getMenuByUserId = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await Menu
            .findAll({
                where: { userId: req.params.userId },
                attributes:['uuid','nama_menu','harga','jenis','gambar'],
                include:[
                    {
                        model: User,
                        attributes:['id','nama_user','email']
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller create data menu
export const createMenu  = async(req, res) =>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.nama_menu;
    const harga = req.body.harga;
    const jenis = req.body.jenis;

    const file = req.files.gambar;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            if(req.role === "admin"){ //jika login sebagai admin
                await Menu.create({
                    nama_menu: name,
                    harga: harga,
                    jenis: jenis, 
                    gambar: fileName, 
                    url: url,
                    userId: req.userId
                });
                res.status(201).json({msg: "Menu Created Successfuly"});
            }
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    })
}

// controller update data menu
export const updateMenu  = async(req, res) =>{
    try {
        const menu = await Menu.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!menu) return res.status(404).json({msg: "Data tidak ditemukan"});

        let fileName = "";
        if(req.files === null){
            fileName = menu.gambar;
        }else{
            const file = req.files.gambar;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            const allowedType = ['.png','.jpg','.jpeg'];

            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
            if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

            const filepath = `./public/images/${menu.gambar}`;
            fs.unlinkSync(filepath);

            file.mv(`./public/images/${fileName}`, (err)=>{
                if(err) return res.status(500).json({msg: err.message});
            });
        }

        const name = req.body.nama_menu;
        const harga = req.body.harga;
        const jenis = req.body.jenis;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

        if(req.role === "admin"){ //harus admin
            await Menu.update({
                nama_menu: name,
                harga: harga,
                jenis: jenis, 
                gambar: fileName, 
                url: url
            },{
                where:{
                    uuid: req.params.id
                }
            });
        }
        // else{ //jika tidak
        //     if(req.userId !== menu.userId) return res.status(403).json({msg: "Akses terlarang"});
        //     await Menu.update({
        //         nama_menu: name,
        //         harga: harga,
        //         jenis: jenis, 
        //         gambar: fileName, 
        //         url: url,
        //         userId: req.userId
        //     },{
        //         where:{
        //             [Op.and]:[{id: menu.id}, {userId: req.userId}]
        //         }
        //     });
        // }
        res.status(200).json({msg: "Menu updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller delete data menu
export const deleteMenu = async(req, res) =>{
    try {
        const menu = await Menu.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!menu) return res.status(404).json({msg: "Data tidak ditemukan"});
        
        if(req.role === "admin"){
            const filepath = `./public/images/${menu.gambar}`;
            fs.unlinkSync(filepath);
            await Menu.destroy({
                where:{
                    id: menu.id
                }
            });
        }else{
            if(req.userId !== menu.userId) return res.status(403).json({msg: "Akses terlarang"});
        }
        res.status(200).json({msg: "Menu deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}