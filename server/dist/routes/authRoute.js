"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController_1 = require("../controllers/authController");
router.route("/register").post(authController_1.registerUser);
router.route("/login").post(authController_1.loginUser);
router.route("/logout").post(authController_1.logoutUser);
router.route("/refresh").post(authController_1.refreshUser);
exports.default = router;
