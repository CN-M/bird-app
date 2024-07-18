"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_1 = require("./data");
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash("12345", 12);
    const hashedBatmanPassword = await bcryptjs_1.default.hash("SUPERMAN-SUCKZ", 12);
    const hashedSupermanPassword = await bcryptjs_1.default.hash("LoisLane123", 12);
    const hashedWonderWomanPassword = await bcryptjs_1.default.hash("SUPERMAN-SUCKZ", 12);
    // Create Batman guest account
    const batman = await prisma.user.create({
        data: {
            username: "batman",
            email: "bruce.wayne@wayneenterprises.com",
            profileName: "Bruce Wayne",
            password: hashedBatmanPassword,
            profilePicture: "https://www.superherodb.com/pictures2/portraits/10/100/639.jpg", // Example profile picture URL
            isPremium: true,
            bio: data_1.batmanBio,
        },
    });
    // Create Superman guest account
    const superman = await prisma.user.create({
        data: {
            username: "superman",
            email: "clark.kent@dailyplanet.com",
            profileName: "Clark Kent",
            password: hashedSupermanPassword,
            profilePicture: "https://www.superherodb.com/pictures2/portraits/10/100/791.jpg", // Example profile picture URL
            isPremium: true,
            bio: data_1.supermanBio,
        },
    });
    // Create Wonder Woman guest account
    const wonderWoman = await prisma.user.create({
        data: {
            username: "wonderwoman",
            email: "diana.prince@themyscira.gov",
            profileName: "Diana Prince",
            password: hashedWonderWomanPassword,
            profilePicture: "https://www.superherodb.com/pictures2/portraits/10/100/807.jpg", // Example profile picture URL
            isPremium: true,
            bio: data_1.wonderWomanBio,
        },
    });
    // Find or create Batman, Superman, and Wonder Woman users (assuming they already exist)
    const [batmanAccount, supermanAccount, wonderWomanAccount] = await Promise.all([
        prisma.user.findFirst({ where: { username: "batman" } }),
        prisma.user.findFirst({ where: { username: "superman" } }),
        prisma.user.findFirst({ where: { username: "wonderwoman" } }),
    ]);
    // Seed Batman's posts
    for (let i = 0; i < data_1.batmanPosts.length; i++) {
        await prisma.post.create({
            data: {
                content: data_1.batmanPosts[i],
                authorId: batmanAccount.id,
            },
        });
    }
    // Seed Superman's posts
    for (let i = 0; i < data_1.supermanPosts.length; i++) {
        await prisma.post.create({
            data: {
                content: data_1.supermanPosts[i],
                authorId: supermanAccount.id,
            },
        });
    }
    // Seed Wonder Woman's posts
    for (let i = 0; i < data_1.wonderWomanPosts.length; i++) {
        await prisma.post.create({
            data: {
                content: data_1.wonderWomanPosts[i],
                authorId: wonderWomanAccount.id,
            },
        });
    }
    console.log("Superheroes and their posts seeded successfully!");
    // Create fake users
    // const users = [batman, superman, wonderWoman];
    const users = [];
    for (let i = 0; i < 18; i++) {
        const user = await prisma.user.create({
            data: {
                username: faker_1.faker.internet.userName().toLowerCase(),
                email: faker_1.faker.internet.email().toLowerCase(),
                profileName: faker_1.faker.person.fullName(),
                password: hashedPassword,
                profilePicture: faker_1.faker.image.avatar(),
                isPremium: faker_1.faker.datatype.boolean(),
                bio: data_1.bios[i],
            },
        });
        users.push(user);
    }
    // Create fake posts
    for (let i = 0; i < 30; i++) {
        await prisma.post.create({
            data: {
                content: data_1.posts[i],
                authorId: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })].id,
            },
        });
    }
    // Create fake comments
    const posts = await prisma.post.findMany();
    for (let i = 0; i < 50; i++) {
        await prisma.comment.create({
            data: {
                // content: faker.lorem.sentences(2),
                content: data_1.comments[i],
                authorId: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })].id,
                postId: posts[faker_1.faker.number.int({ min: 0, max: posts.length - 1 })].id,
            },
        });
    }
    // Create fake replies to comments
    const comments = await prisma.comment.findMany();
    for (let i = 0; i < 30; i++) {
        const randInt = faker_1.faker.number.int({ min: 0, max: comments.length - 1 });
        await prisma.comment.create({
            data: {
                // content: faker.lorem.sentences(2),
                content: data_1.replies[i],
                authorId: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })].id,
                parentCommentId: comments[randInt].id,
                postId: comments[randInt].postId,
            },
        });
    }
    // Create fake likes
    for (let i = 0; i < 120; i++) {
        const randomUser = users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })];
        const randomPost = posts[faker_1.faker.number.int({ min: 0, max: posts.length - 1 })];
        const randomComment = comments[faker_1.faker.number.int({ min: 0, max: comments.length - 1 })];
        // Randomly like a post or a comment
        if (faker_1.faker.datatype.boolean()) {
            await prisma.like.create({
                data: {
                    userId: randomUser.id,
                    postId: randomPost.id,
                },
            });
        }
        else {
            await prisma.like.create({
                data: {
                    userId: randomUser.id,
                    commentId: randomComment.id,
                },
            });
        }
    }
    // Create fake followers
    for (let i = 0; i < 50; i++) {
        const follower = users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })];
        const following = users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })];
        if (follower.id !== following.id) {
            await prisma.follower.create({
                data: {
                    followerId: follower.id,
                    followingId: following.id,
                },
            });
        }
    }
    // Create fake bookmarks
    for (let i = 0; i < 50; i++) {
        const randomUser = users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })];
        const randomPost = posts[faker_1.faker.number.int({ min: 0, max: posts.length - 1 })];
        await prisma.bookmark.create({
            data: {
                userId: randomUser.id,
                postId: randomPost.id,
            },
        });
    }
    console.log("User accounts, posts, bookmarks, comments, and replies seeded successfully!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
