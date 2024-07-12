"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
router
    .route("/:postId/:commentId")
    .get(commentController_1.getSingleComment)
    .put(authMiddleware_1.protect, commentController_1.updateComment)
    .delete(authMiddleware_1.protect, commentController_1.deleteComment);
router
    .route("/:postId/:commentId/:replyId")
    .get(commentController_1.getCommentReplies)
    .put(authMiddleware_1.protect, commentController_1.updateComment)
    .delete(authMiddleware_1.protect, commentController_1.deleteComment);
router.route("/comment").post(authMiddleware_1.protect, commentController_1.createPostComment);
router.route("/reply").post(authMiddleware_1.protect, commentController_1.createCommentReply);
exports.default = router;
