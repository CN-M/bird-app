import express from "express";

const router = express.Router();

import {
  deleteUserAccount,
  downgradeUser,
  editUserProfile,
  followUser,
  getUser,
  unfollowUser,
  upgradeUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

router.route("/:username/edit").put(protect, editUserProfile);
router.route("/:username/upgrade").put(protect, upgradeUser);
router.route("/:username/downgrade").put(protect, downgradeUser);

router.route("/:username").get(getUser).delete(protect, deleteUserAccount);

router.route("/follow").post(protect, followUser);
router.route("/unfollow").delete(protect, unfollowUser);

export default router;
