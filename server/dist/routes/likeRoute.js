"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const likeController_1 = require("../controllers/likeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
router
    .route("/:postId/post")
    .post(authMiddleware_1.protect, likeController_1.likePost)
    .get(likeController_1.getPostLikes)
    .delete(authMiddleware_1.protect, likeController_1.unlikePost);
router
    .route("/:commentId/comment")
    .get(likeController_1.getCommentLikes)
    .post(authMiddleware_1.protect, likeController_1.likeComment)
    .delete(authMiddleware_1.protect, likeController_1.unlikeComment);
router
    .route("/:postId/:commentId/:replyId")
    .get(likeController_1.getCommentLikes)
    .post(authMiddleware_1.protect, likeController_1.likeComment)
    .delete(authMiddleware_1.protect, likeController_1.unlikeComment);
exports.default = router;
