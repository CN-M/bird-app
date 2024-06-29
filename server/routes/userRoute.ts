import express from "express";

const router = express.Router();

import {
  deleteUserAccount,
  editUserProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

router
  .route("/")
  .delete(protect, deleteUserAccount)
  .put(protect, editUserProfile);

export default router;
