// import library
import express from "express";

// import controller
import {
    getMenu, 
    getMenuById,
    getMenuByJenis,
    getMenuByUserId,
    createMenu,
    updateMenu,
    deleteMenu
} from "../controllers/MenuController.js";

// implementasi library
const router = express.Router();

// import authUser moddleware & protected route
import { verifyUser } from "../middleware/AuthUser.js";
// admin only
import { adminOnly } from "../middleware/AuthUser.js";

// implementasi controller -> router
router.get('/menu', verifyUser, getMenu);
router.get('/menu/:id', verifyUser, getMenuById);
router.get('/menu/user/:userId', verifyUser, getMenuByUserId);
router.get('/menu/jenis/:jenis', verifyUser, getMenuByJenis);
router.post('/menu', verifyUser, adminOnly, createMenu);
router.patch('/menu/:id', verifyUser, adminOnly, updateMenu);
router.delete('/menu/:id', verifyUser, adminOnly, deleteMenu);

export default router;