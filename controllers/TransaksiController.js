// import model
import Meja from "../models/MejaModel.js";
import Transaksi from "../models/TransaksiModel.js";
import User from "../models/UserModel.js";

import { Op } from "sequelize";

// controller get data transaksi
export const getTransaksi = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await Transaksi
            .findAll({
                attributes:['id','tgl_transaksi','nama_pelanggan','status_transaksi'],
                include:[
                    {
                        model: Meja,
                        attributes:['nomor_meja','status_meja']
                    },
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

// controller search data transaksi by id transaksi
export const getTransaksiById = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await Transaksi
            .findByPk(req.params.id,{
                attributes:['id','tgl_transaksi','nama_pelanggan','status_transaksi'],
                include:[
                    {
                        model: Meja,
                        attributes:['nomor_meja','status_meja']
                    },
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
export const getTransaksiByIdUser = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await Transaksi
            .findAll({
                where: { userId: req.params.userId },
                attributes:['uuid','tgl_transaksi','nama_pelanggan','status_transaksi'],
                include:[
                    {
                        model: Meja,
                        attributes:['nomor_meja','status_meja']
                    },
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

// controller create data transaksi
export const createTransaksi  = async(req, res) =>{
    const {mejaId, nama_pelanggan, status_transaksi} = req.body;
    try {
        if(req.role === "kasir"){ //jika login sebagai admin
            await Transaksi
            .create({
                mejaId: mejaId,
                nama_pelanggan: nama_pelanggan,
                status_transaksi : status_transaksi,
                userId: req.userId
            });
            // update status meja
            Meja.update({ 
                status_meja: "terisi" }, 
                { where: { id: req.body.mejaId } 
            }); // mengubah status meja menjadi terisi
            res.status(201).json({msg: "Transaksi Created Successfuly"});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller update data transaksi
export const updateTransaksi  = async(req, res) =>{
    try {
        const transaksi = await Transaksi.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!transaksi) return res.status(404).json({msg: "Data tidak ditemukan"});

        const {mejaId, nama_pelanggan, status_transaksi} = req.body;
        if(req.role === "kasir"){ //harus admin
            await Transaksi.update({
                mejaId, 
                nama_pelanggan, 
                status_transaksi
            },{
                where:{
                    id: transaksi.id
                }
            });
        }else{ //jika tidak
            res.status(403).json({msg: "Akses terlarang"});
        }
        // update status meja
        if (req.body.status_transaksi === "lunas") {
            Meja.update({ status_meja: "kosong" }, { where: { id: req.body.mejaId } }); // mengubah status meja menjadi kosong
        }
        res.status(200).json({msg: "Transaksi updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller delete data transaksi
export const deleteTransaksi = async(req, res) =>{
    try {
        const transaksi = await Transaksi.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!transaksi) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "kasir"){
            await Transaksi.destroy({
                where:{
                    id: transaksi.id
                }
            });
        }else{
            if(req.userId !== transaksi.userId) return res.status(403).json({msg: "Akses terlarang"});
        }
        res.status(200).json({msg: "Transaksi deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// filtering transaksi berdasarkan tgl_transaksi
export const filterTanggalTransaksi = async(req, res) =>{
    const param = { tgl_transaksi: req.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
    try {
        const transaksi = await Transaksi.findAll({
            where:{
                tgl_transaksi: req.params.tgl_transaksi
            }
        });
        if(!transaksi) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin", "manajer", "kasir"){
            response = await Transaksi.findAll({
                where: {
                    tgl_transaksi: {
                      [Op.between]: [
                        param.tgl_transaksi + " 00:00:00",
                        param.tgl_transaksi + " 23:59:59",
                      ], // mencari data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
                    }
                },
                attributes:['id','tgl_transaksi','nama_pelanggan','status_transaksi'],
                include:[
                    {
                        model: Meja,
                        attributes:['nomor_meja','status_meja']
                    },
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

// filtering transaksi berdasarkan nama_user dari tabel user
export const filterNamaUserTransaksi = async(req, res) =>{
    const param = { nama_user: req.params.nama_user }; // inisialisasi parameter yang akan dikirimkan melalui parameter
    try {
        const transaksi = await User.findAll({
            where:{
                nama_user: param.nama_user
            }
        });
        if(!transaksi) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin", "manajer", "kasir"){
            response = await Transaksi.findAll({
                attributes:['id','tgl_transaksi','userId','mejaId','nama_pelanggan','status_transaksi'],
                include:[
                    {
                        model: Meja,
                        attributes:['nomor_meja','status_meja']
                    },
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

// filtering transaksi berdasarkan bulan transaksi dari tgl_transaksi
export const filterBulanTransaksi = async(req, res) =>{
    const params = { bulan_transaksi: req.params.bulan_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

    try {
        const transaksi = await Transaksi.findAll({
            tgl_transaksi: req.params.tgl_transaksi
        });
        if(!transaksi) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin", "manajer", "kasir"){
            response = await Transaksi.findAll({
                attributes:['id','tgl_transaksi','userId','mejaId','nama_pelanggan','status_transaksi'],
                where:{
                    tgl_transaksi: {
                        //mengambil 2 digit pertama dari bulan transaksi yang dikirimkan melalui parameter
                        [Op.like]: params.bulan_transaksi + "%",
                    }
                },
                include:[
                    {
                        model: Meja,
                        attributes:['nomor_meja','status_meja']
                    },
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