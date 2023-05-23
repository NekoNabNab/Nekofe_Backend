// import library
import express from "express";

// import controller
import {
    getUser, 
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";

// import authUser middleware & protected route, jd harus login dullu biar bisa
import { verifyUser } from "../middleware/AuthUser.js";
// admin only, hanya jika anda login sebagai admin
import { adminOnly } from "../middleware/AuthUser.js";

// implementasi library
const router = express.Router();

// implementasi controller -> router
router.get('/user', verifyUser, adminOnly, getUser);
router.get('/user/:id', verifyUser, adminOnly, getUserById);
router.post('/user',verifyUser, adminOnly, createUser);
router.patch('/user/:id', verifyUser, adminOnly, updateUser);
router.delete('/user/:id', verifyUser, adminOnly, deleteUser);

export default router;