import express from "express";

const router = express.Router();

import {
    createCommentReply,
    createPostComment,
    deleteComment,
    getCommentReplies,
    getPostComments,
    updateComment,
} from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

router
  .route("/:postId/:commentId")
  .get(getPostComments)
  .put(protect, updateComment)
  .delete(protect, deleteComment);
  
router
  .route("/:postId/:commentId/:replyId")
  .get(getCommentReplies)
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.route("/comment").post(createPostComment);
router.route("/reply").post(createCommentReply);

export default router;
