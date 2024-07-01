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

router
  .route("/")
  .get(getGeneralFeed) // X
  .post(protect, createPost);

router.route("/feed").get(protect, getFollowingFeed); // X

router.route("/:userId/feed").get(getSingleUserFeed); // X

router
  .route("/:postId")
  .get(getSinglePost) // ${rootURL}/posts/${userId}/${postId} // X
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
