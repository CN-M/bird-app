import express from "express";

const router = express.Router();

import {
  createPost,
  deletePost,
  getGeneralFeedPosts,
  getUserFeedPosts,
  getUserPosts,
  updatePost,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

router.route("/").get(getGeneralFeedPosts).post(protect, createPost);

router.route("/feed").get(protect, getUserFeedPosts);

router
  .route("/:id")
  .get(protect, getUserPosts)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
