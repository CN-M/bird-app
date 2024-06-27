import express from "express";

const router = express.Router();

import { deleteUser, updateUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

router.route("/").delete(protect, deleteUser).put(protect, updateUser);

export default router;
