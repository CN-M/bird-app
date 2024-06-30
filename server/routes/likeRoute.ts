import express from "express";

const router = express.Router();

import {
  getCommentLikes,
  getPostLikes,
  likeComment,
  likePost,
  unlikeComment,
  unlikePost,
} from "../controllers/likeController";
import { protect } from "../middleware/authMiddleware";

router
  .route("/:postId")
  .get(getPostLikes)
  .post(protect, likePost)
  .delete(protect, unlikePost);

router
  .route("/:postId/:commentId")
  .get(getCommentLikes)
  .post(protect, likeComment)
  .delete(protect, unlikeComment);

router
  .route("/:postId/:commentId/:replyId")
  .get(getCommentLikes)
  .post(protect, likeComment)
  .delete(protect, unlikeComment);

export default router;
