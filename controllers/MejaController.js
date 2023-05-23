// import model
import Meja from "../models/MejaModel.js";
import User from "../models/UserModel.js";

// controller get data Meja
export const getMeja = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data meja
            response = await Meja.findAll({
                attributes:['uuid','nomor_meja', 'status_meja'],
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

// controller search data Meja by id
export const getMejaById = async(req, res) =>{
    try {
        const meja = await Meja.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!meja) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin", "manajer", "kasir"){
            response = await Meja.findOne({
                attributes:['uuid','nomor_meja', 'status_meja'],
                where:{
                    id: meja.id
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

// controller create data Meja
export const createMeja  = async(req, res) =>{
    const {nomor_meja} = req.body;
    try {
        if(req.role === "admin"){ //jika login sebagai admin
            await Meja.create({
                nomor_meja: nomor_meja,
                status_meja: "kosong",
                userId: req.userId
            });
            res.status(201).json({msg: "Meja Created Successfuly"});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller update data Meja
export const updateMeja  = async(req, res) =>{
    try {
        const meja = await Meja.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!meja) return res.status(404).json({msg: "Data tidak ditemukan"});

        const {nomor_meja} = req.body;
        if(req.role === "admin"){ //harus admin
            await Meja.update({nomor_meja},{
                where:{
                    id: meja.id
                }
            });
        }else{ //jika tidak
            if(req.userId !== meja.userId) return res.status(403).json({msg: "Akses terlarang"});
        }
        res.status(200).json({msg: "Meja updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller delete data Meja
export const deleteMeja = async(req, res) =>{
    try {
        const meja = await Meja.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!meja) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {nomor_meja, status_meja} = req.body;
        if(req.role === "admin"){
            await Meja.destroy({
                where:{
                    id: meja.id
                }
            });
        }else{
            if(req.userId !== meja.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Meja.destroy({
                where:{
                    [Op.and]:[{id: meja.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Meja deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}