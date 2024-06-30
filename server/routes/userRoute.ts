import express from "express";

const router = express.Router();

import {
  deleteUserAccount,
  downgradeUser,
  editUserProfile,
  followUser,
  unfollowUser,
  upgradeUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

router.route("/:id/edit").put(protect, editUserProfile);
router.route("/:id/upgrade").put(protect, upgradeUser);
router.route("/:id/downgrade").put(protect, downgradeUser);

router.route("/:id").delete(protect, deleteUserAccount);

router.route("/follow").post(protect, followUser);
router.route("/unfollow").delete(protect, unfollowUser);

export default router;
