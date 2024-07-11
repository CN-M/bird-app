"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const { SECRET, REFRESH_SECRET } = process.env;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, SECRET, { expiresIn: "1h" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign(user, REFRESH_SECRET, { expiresIn: "15d" });
};
exports.generateRefreshToken = generateRefreshToken;
