// import library
import express from "express";

// import controller
import {
    getMeja, 
    getMejaById,
    createMeja,
    updateMeja,
    deleteMeja
} from "../controllers/MejaController.js";

// implementasi library
const router = express.Router();

// import authUser moddleware & protected route
import { verifyUser } from "../middleware/AuthUser.js";
// admin only
import { adminOnly } from "../middleware/AuthUser.js";

// implementasi controller -> router
router.get('/meja', verifyUser, getMeja);
router.get('/meja/:id', verifyUser, getMejaById);
router.post('/meja', verifyUser, adminOnly, createMeja);
router.patch('/meja/:id', verifyUser, adminOnly, updateMeja);
router.delete('/meja/:id', verifyUser, adminOnly, deleteMeja);

export default router;