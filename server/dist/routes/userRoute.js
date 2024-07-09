"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
router.route("/:id/edit").put(authMiddleware_1.protect, userController_1.editUserProfile);
router.route("/:id/upgrade").put(authMiddleware_1.protect, userController_1.upgradeUser);
router.route("/:id/downgrade").put(authMiddleware_1.protect, userController_1.downgradeUser);
router.route("/:id").delete(authMiddleware_1.protect, userController_1.deleteUserAccount);
router.route("/follow").post(authMiddleware_1.protect, userController_1.followUser);
router.route("/unfollow").delete(authMiddleware_1.protect, userController_1.unfollowUser);
exports.default = router;
