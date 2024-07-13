"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createCommentReply = exports.createPostComment = exports.getCommentReplies = exports.getSingleComment = void 0;
const db_1 = require("../config/db");
const getSingleComment = async (req, res) => {
    const { postId, commentId: id } = req.params;
    try {
        const comments = await db_1.prisma.comment.findFirst({
            where: { id, postId, parentCommentId: null },
            select: {
                author: {
                    select: {
                        username: true,
                        profileName: true,
                        profilePicture: true,
                        id: true,
                        isPremium: true,
                    },
                },
                content: true,
                id: true,
                postId: true,
                createdAt: true,
                parentCommentId: true,
                authorId: true,
                likes: true,
                replies: {
                    select: {
                        author: {
                            select: {
                                username: true,
                                profileName: true,
                                profilePicture: true,
                                id: true,
                                isPremium: true,
                            },
                        },
                        content: true,
                        parentCommentId: true,
                        authorId: true,
                        createdAt: true,
                        likes: true,
                        replies: true,
                        postId: true,
                        id: true,
                    },
                },
            },
        });
        if (!comments) {
            return res
                .status(200)
                .json({ comments: 0, message: "No comments on this post" });
        }
        return res.status(200).json(comments);
    }
    catch (err) {
        console.error("Error fetching comments", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getSingleComment = getSingleComment;
const getCommentReplies = async (req, res) => {
    const { postId, commentId, replyId } = req.params;
    try {
        const comments = await db_1.prisma.comment.findFirst({
            where: { postId, parentCommentId: commentId, id: replyId },
            select: {
                author: {
                    select: {
                        username: true,
                        profileName: true,
                        profilePicture: true,
                        id: true,
                        isPremium: true,
                    },
                },
                content: true,
                id: true,
                postId: true,
                createdAt: true,
                parentCommentId: true,
                authorId: true,
                likes: true,
                replies: {
                    select: {
                        author: {
                            select: {
                                username: true,
                                profileName: true,
                                profilePicture: true,
                                id: true,
                                isPremium: true,
                            },
                        },
                        content: true,
                        parentCommentId: true,
                        authorId: true,
                        createdAt: true,
                        likes: true,
                        replies: true,
                        postId: true,
                        id: true,
                    },
                },
            },
        });
        if (!comments) {
            return res
                .status(200)
                .json({ replies: 0, message: "No replies on this comment" });
        }
        return res.status(200).json(comments);
    }
    catch (err) {
        console.error("Error fetching replies", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getCommentReplies = getCommentReplies;
const createPostComment = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { content, postId } = req.body;
    const { id: userId } = user;
    try {
        const newComment = await db_1.prisma.comment.create({
            data: {
                content,
                author: { connect: { id: userId } },
                post: { connect: { id: postId } },
            },
        });
        res.status(200).json(newComment);
    }
    catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.createPostComment = createPostComment;
const createCommentReply = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { content, postId, commentId } = req.body;
    const { id: userId } = user;
    try {
        const newPostComment = await db_1.prisma.comment.create({
            data: {
                content,
                post: { connect: { id: postId } },
                parentComment: { connect: { id: commentId } },
                author: { connect: { id: userId } },
            },
        });
        res.status(200).json(newPostComment);
    }
    catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.createCommentReply = createCommentReply;
const updateComment = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    if (!user.isPremium) {
        return res.status(400).json({ error: "Not Premium, not permitted" });
    }
    const { id: commentId } = req.params;
    const { content } = req.body;
    const { id: userId } = user;
    try {
        const comment = await db_1.prisma.comment.findFirst({
            where: { id: commentId, authorId: userId },
        });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        const { id } = comment;
        const updatedComment = await db_1.prisma.comment.update({
            where: { id },
            data: {
                content,
            },
        });
        res.status(200).json(updatedComment);
    }
    catch (err) {
        console.error("Error updating comment:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res
            .status(400)
            .json({ error: "Not authoriized, please login or register" });
    }
    const { id: commentId } = req.params;
    const { id: userId } = user;
    try {
        const comment = await db_1.prisma.comment.findFirst({
            where: { id: commentId, authorId: userId },
        });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        const { id } = comment;
        const deletedComment = await db_1.prisma.comment.delete({
            where: { id },
        });
        res
            .status(200)
            .json({ message: "Comment deleted", comment: deletedComment });
    }
    catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.deleteComment = deleteComment;
