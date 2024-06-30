import express from "express";

const router = express.Router();

import {
  createPost,
  deletePost,
  getFollowingFeed,
  getGeneralFeed,
  getSinglePost,
  getSingleUserFeed,
  updatePost,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

router.route("/").get(getGeneralFeed).post(protect, createPost);

router.route("/feed").get(protect, getFollowingFeed);

router.route("/:userId/feed").get(getSingleUserFeed);

router
  .route("/:postId")
  .get(getSinglePost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
