import express from "express";

const router = express.Router();

import {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
} from "../controllers/authController";

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logoutUser);
router.route("/refresh").post(refreshUser);

export default router;
