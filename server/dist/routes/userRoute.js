"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
router.route("/relationship").post(authMiddleware_1.protect, userController_1.getFollowRelationship);
router.route("/follow").post(authMiddleware_1.protect, userController_1.followUser);
router.route("/unfollow").delete(authMiddleware_1.protect, userController_1.unfollowUser);
router.route("/:username/edit").put(authMiddleware_1.protect, userController_1.editUserProfile);
router.route("/:username/upgrade").put(authMiddleware_1.protect, userController_1.upgradeUser);
router.route("/:username/downgrade").put(authMiddleware_1.protect, userController_1.downgradeUser);
router.route("/:username").get(userController_1.getUser).delete(authMiddleware_1.protect, userController_1.deleteUserAccount);
exports.default = router;
