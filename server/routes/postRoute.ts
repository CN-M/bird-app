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
import {
  cacheSinglePost,
  cacheSingleUserFeed,
  cacheUserFeed,
} from "../middleware/cacheMiddleware";

router.route("/").get(getGeneralFeed).post(protect, createPost);

router.route("/feed").get(protect, cacheUserFeed, getFollowingFeed);

router.route("/:username/feed").get(cacheSingleUserFeed, getSingleUserFeed);

router
  .route("/:username/:postId")
  .get(cacheSinglePost, getSinglePost) // ${rootURL}/posts/${userId}/${postId}
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
