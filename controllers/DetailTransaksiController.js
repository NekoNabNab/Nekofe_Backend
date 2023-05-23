// import model
import DetailTransaksi from "../models/DetailTransaksiModel.js";
import Meja from "../models/MejaModel.js";
import Menu from "../models/MenuModel.js";
import User from "../models/UserModel.js";

// import library 
import { Op, fn, col, literal } from "sequelize";
import Transaksi from "../models/TransaksiModel.js";

// controller get data detail transaksi
export const getDetailTransaksi = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await DetailTransaksi
            .findAll({
                attributes:['id','menuId','transaksiId','harga','jumlah'],
                include:[
                    {
                        model: Transaksi,
                        attributes:['nama_pelanggan','status_transaksi']
                    },
                    {
                        model: Menu,
                        attributes:['nama_menu','jenis']
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller search data detail transaksi by id detail transaksi
export const getDetailTransaksiById = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await DetailTransaksi
            .findByPk(req.params.id,{
                attributes:['id','menuId','transaksiId','harga','jumlah'],
                include:[
                    {
                        model: Transaksi,
                        attributes:['nama_pelanggan','status_transaksi']
                    },
                    {
                        model: Menu,
                        attributes:['nama_menu','jenis']
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
export const getDetailTransaksiByIdTransaksi = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await DetailTransaksi
            .findAll({
                where: { transaksiId: req.params.transaksiId },
                attributes:['id','menuId','transaksiId','harga','jumlah'],
                include:[
                    {
                        model: Transaksi,
                        attributes:['nama_pelanggan','status_transaksi']
                    },
                    {
                        model: Menu,
                        attributes:['nama_menu','jenis']
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller create data detail transaksi
export const createDetailTransaksi  = async(req, res) =>{
    const {transaksiId, menuId, harga, jumlah} = req.body;
    try {
        if(req.role === "kasir"){ //jika login sebagai admin
            await DetailTransaksi
            .create({
                transaksiId: transaksiId,
                menuId: menuId,
                harga : harga,
                jumlah : jumlah,
                userId: req.userId
            });
            res.status(201).json({msg: "DetailTransaksi Created Successfuly"});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller update data detail transaksi
export const updateDetailTransaksi  = async(req, res) =>{
    try {
        const detailtransaksi = await DetailTransaksi.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!detailtransaksi) return res.status(404).json({msg: "Data tidak ditemukan"});

        const {transaksiId, menuId, harga, jumlah} = req.body;
        if(req.role === "kasir"){ //harus admin
            await DetailTransaksi.update({
                transaksiId, 
                menuId, 
                harga,
                jumlah
            },{
                where:{
                    id: detailtransaksi.id
                }
            });
        }else{ //jika tidak
            res.status(403).json({msg: "Akses terlarang"});
        }
        res.status(200).json({msg: "DetailTransaksi updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// controller delete data detail transaksi
export const deleteDetailTransaksi = async(req, res) =>{
    try {
        const detailtransaksi = await DetailTransaksi.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!detailtransaksi) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "kasir"){
            await DetailTransaksi.destroy({
                where:{
                    id: detailtransaksi.id
                }
            });
        }else{
            if(req.userId !== detailtransaksi.userId) return res.status(403).json({msg: "Akses terlarang"});
        }
        res.status(200).json({msg: "DetailTransaksi deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// mencari total pendapatan berdasarkan tanggal
export const getPendapatanTanggal = async(req, res) =>{
    const param = { tgl_transaksi: req.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await DetailTransaksi
            .findAll({
                attributes:[fn('SUM', col(DetailTransaksi.harga)), 'pendapatan'],
                include:[
                    {
                        model: Transaksi,
                        where: {
                            tgl_transaksi: {
                              [Op.between]: [
                                param.tgl_transaksi + " 00:00:00",
                                param.tgl_transaksi + " 23:59:59",
                              ], // mencari data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
                            }
                        },
                        attributes:['nama_pelanggan','status_transaksi']
                    },
                    {
                        model: Menu,
                        attributes:['nama_menu','jenis']
                    }
                ],
                group: [DetailTransaksi.transaksiId]
            });
        }
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
            status: "success",
            data: response,
            total_keseluruhan: response.reduce((a, b) => a + parseInt(b.dataValues.pendapatan), 0) // menghitung total keseluruhan pendapatan
        });

    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// mencari total pendapatan berdasarkan bulan
export const getPendapatanBulan = async(req, res) =>{
    const params = { bulan_transaksi: req.params.bulan_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

    try {
        const transaksi = await DetailTransaksi.findAll({
            tgl_transaksi: req.params.tgl_transaksi
        });
        if(!transaksi) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin", "manajer", "kasir"){
            response = await DetailTransaksi.findAll({
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

/// mencari menu yang paling banyak di pesan dan yang paling sedikit di pesan
export const getMenuDetailTransaksi = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin","manajer","kasir"){ //semua role bisa melihat data transaksi
            response = await DetailTransaksi
            .findAll({
                attributes:[
                    'id','menuId','transaksiId','harga',
                    [fn('SUM', col('detail_transaksi.jumlah')), 'jumlah']
                ],
                include:[
                    {
                        model: DetailTransaksi,
                        attributes:['nama_pelanggan','status_transaksi']
                    },
                    {
                        model: Menu,
                        attributes:['nama_menu','jenis']
                    }
                ],
                group: ['menuId'],
                order: [[literal('jumlah'), 'DESC']]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}