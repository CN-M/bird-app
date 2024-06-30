import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create fake users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        profileName: faker.person.fullName(),
        password: "12345",
        profilePicture: faker.image.avatar(),
        isPremium: faker.datatype.boolean(),
      },
    });
    users.push(user);
  }

  // Create fake posts
  for (let i = 0; i < 20; i++) {
    const post = await prisma.post.create({
      data: {
        content: faker.lorem.sentences(3),
        authorId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
      },
    });
  }

  // Create fake comments
  const posts = await prisma.post.findMany();
  for (let i = 0; i < 30; i++) {
    const comment = await prisma.comment.create({
      data: {
        content: faker.lorem.sentences(2),
        authorId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        postId: posts[faker.number.int({ min: 0, max: posts.length - 1 })].id,
      },
    });
  }

  // Create fake likes
  const comments = await prisma.comment.findMany();
  for (let i = 0; i < 50; i++) {
    const randomUser =
      users[faker.number.int({ min: 0, max: users.length - 1 })];
    const randomPost =
      posts[faker.number.int({ min: 0, max: posts.length - 1 })];
    const randomComment =
      comments[faker.number.int({ min: 0, max: comments.length - 1 })];

    // Randomly like a post or a comment
    if (faker.datatype.boolean()) {
      await prisma.like.create({
        data: {
          userId: randomUser.id,
          postId: randomPost.id,
        },
      });
    } else {
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
    const follower = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const following =
      users[faker.number.int({ min: 0, max: users.length - 1 })];
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
