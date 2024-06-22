import express from "express";

const router = express.Router();

import {
  deleteUser,
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  updateUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

router.route("/").delete(protect, deleteUser).put(protect, updateUser);

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logoutUser);
router.route("/refresh").post(refreshUser);

export default router;
