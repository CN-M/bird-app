"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../middleware/authMiddleware");
router
    .route("/")
    .get(postController_1.getGeneralFeed) // X
    .post(authMiddleware_1.protect, postController_1.createPost);
router.route("/feed").get(authMiddleware_1.protect, postController_1.getFollowingFeed); // X
router.route("/:userId/feed").get(postController_1.getSingleUserFeed); // X
router
    .route("/:postId")
    .get(postController_1.getSinglePost) // ${rootURL}/posts/${userId}/${postId} // X
    .put(authMiddleware_1.protect, postController_1.updatePost)
    .delete(authMiddleware_1.protect, postController_1.deletePost);
exports.default = router;
