import express from "express";

const router = express.Router();

import {
  deleteUserAccount,
  downgradeUser,
  editUserProfile,
  followUser,
  getFollowRelationship,
  getUser,
  unfollowUser,
  upgradeUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

router.route("/relationship").post(protect, getFollowRelationship);

router.route("/follow").post(protect, followUser);
router.route("/unfollow").delete(protect, unfollowUser);

router.route("/:username/edit").put(protect, editUserProfile);
router.route("/:username/upgrade").put(protect, upgradeUser);
router.route("/:username/downgrade").put(protect, downgradeUser);

router.route("/:username").get(getUser).delete(protect, deleteUserAccount);

export default router;
