// import library
import express from "express";

// import controller
import {
    getTransaksi, 
    getTransaksiById,
    getTransaksiByIdUser,
    createTransaksi,
    updateTransaksi,
    deleteTransaksi,
    filterBulanTransaksi,
    filterNamaUserTransaksi,
    filterTanggalTransaksi
} from "../controllers/TransaksiController.js";

// implementasi library
const router = express.Router();

// import authUser moddleware & protected route
import { verifyUser } from "../middleware/AuthUser.js";
// admin only
import { adminOnly } from "../middleware/AuthUser.js";
// kasir only
import { kasirOnly } from "../middleware/AuthUser.js";
// manajer only
import { manajerOnly } from "../middleware/AuthUser.js";

// implementasi controller -> router
router.get('/transaksi', verifyUser, getTransaksi); //alhamdulillah
router.get('/transaksi/:id', verifyUser, getTransaksiById); //alhamdulillah
router.get('/transaksiuserid/:userId', verifyUser, getTransaksiByIdUser); //alhamdulillah
router.post('/transaksi', verifyUser, createTransaksi); //alhamdulillah
router.patch('/transaksi/:id', verifyUser, updateTransaksi); //alhamdulillah
router.delete('/transaksi/:id', verifyUser, deleteTransaksi); //alhamdulillah
router.get('/transaksi/filtertanggal/:tgl_transaksi', verifyUser, filterTanggalTransaksi); //alhamdulillah
router.get('/transaksi/filternamauser/:nama_user', verifyUser, filterNamaUserTransaksi); //alhamdulillah
export default router;