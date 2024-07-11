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
  .route("/:postId/post")
  .post(protect, likePost)
  .get(getPostLikes)
  .delete(protect, unlikePost);

router
  .route("/:commentId/comment")
  .get(getCommentLikes)
  .post(protect, likeComment)
  .delete(protect, unlikeComment);

router
  .route("/:postId/:commentId/:replyId")
  .get(getCommentLikes)
  .post(protect, likeComment)
  .delete(protect, unlikeComment);

export default router;
