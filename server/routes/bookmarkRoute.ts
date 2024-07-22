import express from "express";

const router = express.Router();

import {
  bookmarkPost,
  getPostBookmarks,
  getUserBookmarks,
  unbookmarkPost,
} from "../controllers/bookmarkController";
import { protect } from "../middleware/authMiddleware";

router
  .route("/:postId/post")
  .get(getPostBookmarks)
  .post(protect, bookmarkPost)
  .delete(protect, unbookmarkPost);

router.route("/:username").get(protect, getUserBookmarks);

export default router;
