// import library
import express from "express";

// import controller
import {
    getDetailTransaksi, 
    getDetailTransaksiById,
    getDetailTransaksiByIdTransaksi,
    createDetailTransaksi,
    updateDetailTransaksi,
    deleteDetailTransaksi,
    getPendapatanTanggal,
    getPendapatanBulan,
    getMenuDetailTransaksi
} from "../controllers/DetailTransaksiController.js";

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
router.get('/detailtransaksi', verifyUser, getDetailTransaksi); //alhamdulillah
router.get('/detailtransaksi/:id', verifyUser, getDetailTransaksiById); //alhamdulillah
router.get('/detailtransaksi/idtransaksi/:transaksiId', verifyUser, getDetailTransaksiByIdTransaksi); //alhamdulillah
router.post('/detailtransaksi', verifyUser, createDetailTransaksi); //alhamdulillah
router.patch('/detailtransaksi/:id', verifyUser, updateDetailTransaksi); //alhamdulillah
router.delete('/detailtransaksi/:id', verifyUser, deleteDetailTransaksi); //alhamdulillah

export default router;