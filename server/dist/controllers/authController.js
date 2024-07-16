"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUser = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const util_1 = require("../config/util");
require("dotenv").config();
const { REFRESH_SECRET, NODE_ENV } = process.env;
require("dotenv").config();
const registerUser = async (req, res) => {
    try {
        const { email, username, profileName, password } = req.body;
        if (!email || !profileName || !username || !password) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }
        const lowercaseUsername = username.toLowerCase();
        const userExists = await db_1.prisma.user.findFirst({
            where: { username: lowercaseUsername },
        });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }
        // const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await db_1.prisma.user.create({
            data: {
                profileName,
                email,
                username: lowercaseUsername,
                profilePicture: null,
                // password: hashedPassword,
                password,
            },
        });
        if (newUser) {
            const { id, profileName, email, isPremium, profilePicture } = newUser;
            const accessToken = (0, util_1.generateAccessToken)({
                id,
                username,
                profileName,
                isPremium,
                profilePicture: profilePicture ? profilePicture : "default",
            });
            const refreshToken = (0, util_1.generateRefreshToken)({
                id,
                username,
                profileName,
                isPremium,
                profilePicture: profilePicture ? profilePicture : "default",
            });
            res
                .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                // secure: NODE_ENV === "production",
                secure: true,
                // sameSite: NODE_ENV === "production" ? "strict" : "lax",
                sameSite: "none",
                maxAge: 15 * 24 * 60 * 60 * 1000, // 15 Days
            })
                .header("authorization", accessToken);
            const followExists = await db_1.prisma.follower.findFirst({
                where: { followerId: id, followingId: id },
            });
            if (!followExists) {
                await db_1.prisma.follower.create({
                    data: {
                        follower: { connect: { id } },
                        following: { connect: { id } },
                    },
                });
            }
            return res.status(201).json({
                id,
                profileName,
                profilePicture,
                username,
                accessToken,
            });
        }
        else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }
        const lowercaseUsername = username.toLowerCase();
        const user = await db_1.prisma.user.findFirst({
            where: { username: lowercaseUsername },
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // Remember to change this back
        // const passwordMatch = await bcrypt.compare(password, user.password!);
        const passwordMatch = password === user.password;
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const { id, username: userUsername, profileName, profilePicture, isPremium, email, } = user;
        const accessToken = (0, util_1.generateAccessToken)({
            id,
            username: userUsername,
            profileName,
            isPremium,
            profilePicture: profilePicture ? profilePicture : "default",
        });
        const refreshToken = (0, util_1.generateRefreshToken)({
            id,
            username,
            profileName,
            isPremium,
            profilePicture: profilePicture ? profilePicture : "default",
        });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: NODE_ENV === "production",
            secure: true,
            // sameSite: NODE_ENV === "production" ? "strict" : "lax",
            sameSite: "none",
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 Days
        })
            .header("authorization", accessToken);
        return res.status(201).json({
            id,
            profileName,
            profilePicture,
            username: userUsername,
            accessToken,
        });
    }
    catch (err) {
        console.error("Error logging in user:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        console.log("logout console:", req.cookies["refreshToken"]);
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "User successfully logged out" });
    }
    catch (err) {
        console.error("Error logging out user:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.logoutUser = logoutUser;
const refreshUser = async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
        return res.status(401).json({ error: "Not authorised, no refresh token!" });
    }
    try {
        const { id } = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        const user = await db_1.prisma.user.findFirst({
            where: { id },
            select: {
                id: true,
                profileName: true,
                username: true,
                isPremium: true,
                profilePicture: true,
                email: true,
                password: false,
            },
        });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const newAccessToken = (0, util_1.generateAccessToken)(user);
        res.header("authorization", newAccessToken);
        req.user = user;
    }
    catch (err) {
        console.error("Error:", err);
        return res.status(401).json({ error: "Invalid refresh token" });
    }
};
exports.refreshUser = refreshUser;
