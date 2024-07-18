"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowUser = exports.followUser = exports.getFollowSuggestions = exports.getFollowRelationship = exports.deleteUserAccount = exports.downgradeUser = exports.upgradeUser = exports.editUserProfile = exports.getUser = void 0;
const db_1 = require("../config/db");
require("dotenv").config();
const getUser = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await db_1.prisma.user.findFirst({
            where: { username },
            select: {
                profileName: true,
                id: true,
                bio: true,
                posts: {
                    select: {
                        author: true,
                        content: true,
                        id: true,
                        likes: true,
                        createdAt: true,
                        comments: {
                            select: {
                                author: { select: { username: true } },
                                content: true,
                                id: true,
                                parentCommentId: true,
                                likes: true,
                                createdAt: true,
                                postId: true,
                                replies: true,
                            },
                        },
                    },
                },
                isPremium: true,
                username: true,
                profilePicture: true,
                followers: true,
                following: true,
            },
        });
        res.status(200).json(user);
    }
    catch (err) {
        console.error("Error updating user data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUser = getUser;
const editUserProfile = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { profileName, profilePicture } = req.body;
    const { username } = req.params;
    try {
        const updatedUser = await db_1.prisma.user.update({
            where: { username },
            data: {
                profileName,
                profilePicture,
            },
            select: { profileName: true, email: true },
        });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error("Error updating user data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.editUserProfile = editUserProfile;
const upgradeUser = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    if (user.isPremium) {
        return res.status(400).json({ error: "User already premium" });
    }
    const { username } = req.params;
    try {
        const updatedUser = await db_1.prisma.user.update({
            where: { username },
            data: {
                isPremium: true,
            },
            select: { profileName: true, email: true },
        });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error("Error updating user data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.upgradeUser = upgradeUser;
const downgradeUser = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    if (!user.isPremium) {
        return res.status(400).json({ error: "User already not premium" });
    }
    const { username } = req.params;
    try {
        const updatedUser = await db_1.prisma.user.update({
            where: { username },
            data: {
                isPremium: false,
            },
            select: { profileName: true, email: true },
        });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error("Error updating user data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.downgradeUser = downgradeUser;
const deleteUserAccount = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { username } = req.params;
    try {
        const deletedUser = await db_1.prisma.user.delete({
            where: { username },
            select: { profileName: true, email: true },
        });
        res.status(200).json({ message: "User deleted", user: deletedUser });
    }
    catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.deleteUserAccount = deleteUserAccount;
const getFollowRelationship = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { followingId } = req.body;
    if (!followingId) {
        return res.status(400).json({ error: "Following ID is required" });
    }
    const { id: userId } = user;
    try {
        const followExists = await db_1.prisma.follower.findFirst({
            where: { followerId: userId, followingId },
        });
        if (!followExists) {
            return res.status(200).json({
                following: false,
                message: `${user.profileName} is not following ${followingId}`,
            });
        }
        else {
            return res.status(200).json({
                following: true,
                message: `${user.profileName} is following ${followingId}`,
                followData: followExists,
            });
        }
    }
    catch (err) {
        console.error("Error following user", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getFollowRelationship = getFollowRelationship;
const getFollowSuggestions = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { id: userId } = user;
    try {
        const following = await db_1.prisma.follower.findMany({
            where: { followerId: userId },
            select: { followingId: true },
        });
        const followingIds = following.map((follower) => follower.followingId);
        const suggestions = await db_1.prisma.user.findMany({
            take: 5,
            where: {
                id: { notIn: followingIds, not: userId },
            },
            select: {
                id: true,
                isPremium: true,
                profileName: true,
                profilePicture: true,
                username: true,
            },
        });
        res.status(200).json(suggestions);
    }
    catch (err) {
        console.error("Error following user", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getFollowSuggestions = getFollowSuggestions;
const followUser = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { followingId } = req.body;
    const { id: userId } = user;
    try {
        const followExists = await db_1.prisma.follower.findFirst({
            where: { followerId: userId, followingId },
        });
        if (followExists) {
            return res.status(400).json({ error: "Already following this user" });
        }
        const newFollow = await db_1.prisma.follower.create({
            data: {
                follower: { connect: { id: userId } },
                following: { connect: { id: followingId } },
            },
        });
        res.status(200).json(newFollow);
    }
    catch (err) {
        console.error("Error following user", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.followUser = followUser;
const unfollowUser = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { followingId } = req.body;
    const { id: userId } = user;
    try {
        const follow = await db_1.prisma.follower.findFirst({
            where: { followerId: userId, followingId },
        });
        if (!follow) {
            return res.status(400).json({ error: "Follow relationship not found" });
        }
        const { id } = follow;
        const deletedFollow = await db_1.prisma.follower.delete({
            where: { id },
        });
        res.status(200).json(deletedFollow);
    }
    catch (err) {
        console.error("Error unfollowing user ", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.unfollowUser = unfollowUser;
