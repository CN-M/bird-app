"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash("12345", 12);
    // Create fake users
    const users = [];
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                username: faker_1.faker.internet.userName(),
                email: faker_1.faker.internet.email(),
                profileName: faker_1.faker.person.fullName(),
                password: hashedPassword,
                profilePicture: faker_1.faker.image.avatar(),
                isPremium: faker_1.faker.datatype.boolean(),
            },
        });
        users.push(user);
    }
    // Create fake posts
    for (let i = 0; i < 20; i++) {
        const post = await prisma.post.create({
            data: {
                content: faker_1.faker.lorem.sentences(3),
                authorId: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })].id,
            },
        });
    }
    // Create fake comments
    const posts = await prisma.post.findMany();
    for (let i = 0; i < 30; i++) {
        const comment = await prisma.comment.create({
            data: {
                content: faker_1.faker.lorem.sentences(2),
                authorId: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })].id,
                postId: posts[faker_1.faker.number.int({ min: 0, max: posts.length - 1 })].id,
            },
        });
    }
    // Create fake likes
    const comments = await prisma.comment.findMany();
    for (let i = 0; i < 50; i++) {
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
    for (let i = 0; i < 20; i++) {
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
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
