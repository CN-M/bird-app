import express from "express";

const router = express.Router();

import {
  bookmarkPost,
  getPostBookmarks,
  getUserBookmarks,
  unbookmarkPost,
} from "../controllers/bookmarkController";
import { protect } from "../middleware/authMiddleware";
import { cacheBookmarks } from "../middleware/cacheMiddleware";

router
  .route("/:postId/post")
  .get(getPostBookmarks)
  .post(protect, bookmarkPost)
  .delete(protect, unbookmarkPost);

router.route("/:username").get(protect, cacheBookmarks, getUserBookmarks);

export default router;
