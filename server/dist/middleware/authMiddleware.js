"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const db_1 = require("../config/db");
const util_1 = require("../config/util");
require("dotenv").config();
const { SECRET, REFRESH_SECRET } = process.env;
const protect = async (req, res, next) => {
    let accessToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;
    let refreshToken = req.cookies["refreshToken"]
        ? req.cookies["refreshToken"]
        : null;
    console.log("Authorized 1");
    console.log(accessToken);
    console.log(refreshToken);
    if (!accessToken || !refreshToken) {
        return res.status(401).json({ error: "Not authorized, no tokens" });
    }
    try {
        const { id } = jsonwebtoken_1.default.verify(accessToken, SECRET);
        const user = await db_1.prisma.user.findFirst({
            where: { id },
            select: {
                id: true,
                username: true,
                profileName: true,
                profilePicture: true,
                isPremium: true,
                email: true,
                password: false,
            },
        });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            try {
                const { id } = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
                const user = await db_1.prisma.user.findFirst({
                    where: { id },
                    select: {
                        id: true,
                        username: true,
                        profileName: true,
                        profilePicture: true,
                        isPremium: true,
                        email: true,
                        password: false,
                    },
                });
                if (!user) {
                    return res.status(400).json({ error: "User not found" });
                }
                const newAccessToken = (0, util_1.generateAccessToken)(user);
                console.log("New Access Token Generated");
                res.header("authorization", newAccessToken);
                req.user = user;
                next();
            }
            catch (err) {
                console.error("Error:", err);
                return res.status(401).json({ error: "Invalid refresh token" });
            }
        }
        else {
            console.error("Error:", err);
            return res.status(401).json({ error: "Not authorized" });
        }
    }
};
exports.protect = protect;
