"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getSinglePost = exports.getSingleUserFeed = exports.getFollowingFeed = exports.getGeneralFeed = void 0;
const db_1 = require("../config/db");
// Do not need to be authed to see these
const getGeneralFeed = async (req, res) => {
    try {
        const posts = await db_1.prisma.post.findMany({ take: 10 });
        res.status(200).json(posts);
    }
    catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.getGeneralFeed = getGeneralFeed;
// Get feed posts of people user is following
const getFollowingFeed = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { id: userId } = user;
    try {
        const following = await db_1.prisma.follower.findMany({
            where: { followingId: userId },
            select: { followingId: true },
        });
        if (!following || following.length === 0) {
            return res.status(400).json({ error: "User not following anyone" });
        }
        const followingIds = following.map((user) => user.followingId);
        const posts = await db_1.prisma.post.findMany({
            where: {
                author: {
                    id: { in: [...followingIds, userId] },
                },
            },
        });
        res.status(200).json(posts);
    }
    catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.getFollowingFeed = getFollowingFeed;
// Get feed of posts by 1 user
const getSingleUserFeed = async (req, res) => {
    // const { user } = req;
    // if (!user) {
    //   return res
    //     .status(400)
    //     .json({ error: "Not authoriized, please login or register" });
    // }
    const { userId } = req.params;
    try {
        const posts = await db_1.prisma.post.findMany({
            where: { authorId: userId },
            take: 10,
        });
        res.status(200).json(posts);
    }
    catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.getSingleUserFeed = getSingleUserFeed;
const getSinglePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await db_1.prisma.post.findFirst({ where: { id: postId } });
        if (!post) {
            res.status(400).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getSinglePost = getSinglePost;
const createPost = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { content } = req.body;
    const { id: userId } = user;
    try {
        const newPost = await db_1.prisma.post.create({
            data: {
                content,
                author: { connect: { id: userId } },
            },
        });
        res.status(200).json(newPost);
    }
    catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    if (!user.isPremium) {
        return res.status(400).json({ error: "Not Premium, not permitted" });
    }
    const { postId } = req.params;
    const { content } = req.body;
    const { id: userId } = user;
    try {
        const post = await db_1.prisma.post.findFirst({
            where: { id: postId, authorId: userId },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const { id } = post;
        const updatedPost = await db_1.prisma.post.update({
            where: { id },
            data: {
                content,
            },
        });
        res.status(200).json(updatedPost);
    }
    catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { postId } = req.params;
    const { id: userId } = user;
    try {
        const post = await db_1.prisma.post.findFirst({
            where: { id: postId, authorId: userId },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const { id } = post;
        const deletedPost = await db_1.prisma.post.delete({
            where: { id },
        });
        res.status(200).json({ message: "Post deleted", post: deletedPost });
    }
    catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.deletePost = deletePost;
