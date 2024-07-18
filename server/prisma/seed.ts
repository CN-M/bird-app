import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  batmanBio,
  batmanPosts,
  bios as fakeBios,
  comments as fakeComments,
  posts as fakePosts,
  replies as fakeReplies,
  supermanBio,
  supermanPosts,
  wonderWomanBio,
  wonderWomanPosts,
} from "./data";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("12345", 12);
  const hashedBatmanPassword = await bcrypt.hash("SUPERMAN-SUCKZ", 12);
  const hashedSupermanPassword = await bcrypt.hash("LoisLane123", 12);
  const hashedWonderWomanPassword = await bcrypt.hash("SUPERMAN-SUCKZ", 12);

  // Create Batman guest account
  const batman = await prisma.user.create({
    data: {
      username: "batman",
      email: "bruce.wayne@wayneenterprises.com",
      profileName: "Bruce Wayne",
      password: hashedBatmanPassword,
      profilePicture:
        "https://www.superherodb.com/pictures2/portraits/10/100/639.jpg", // Example profile picture URL
      isPremium: true,
      bio: batmanBio,
    },
  });

  // Create Superman guest account
  const superman = await prisma.user.create({
    data: {
      username: "superman",
      email: "clark.kent@dailyplanet.com",
      profileName: "Clark Kent",
      password: hashedSupermanPassword,
      profilePicture:
        "https://www.superherodb.com/pictures2/portraits/10/100/791.jpg", // Example profile picture URL
      isPremium: true,
      bio: supermanBio,
    },
  });

  // Create Wonder Woman guest account
  const wonderWoman = await prisma.user.create({
    data: {
      username: "wonderwoman",
      email: "diana.prince@themyscira.gov",
      profileName: "Diana Prince",
      password: hashedWonderWomanPassword,
      profilePicture:
        "https://www.superherodb.com/pictures2/portraits/10/100/807.jpg", // Example profile picture URL
      isPremium: true,
      bio: wonderWomanBio,
    },
  });

  // Find or create Batman, Superman, and Wonder Woman users (assuming they already exist)
  const [batmanAccount, supermanAccount, wonderWomanAccount] =
    await Promise.all([
      prisma.user.findFirst({ where: { username: "batman" } }),
      prisma.user.findFirst({ where: { username: "superman" } }),
      prisma.user.findFirst({ where: { username: "wonderwoman" } }),
    ]);

  // Seed Batman's posts
  for (let i = 0; i < batmanPosts.length; i++) {
    await prisma.post.create({
      data: {
        content: batmanPosts[i],
        authorId: batmanAccount!.id,
      },
    });
  }

  // Seed Superman's posts
  for (let i = 0; i < supermanPosts.length; i++) {
    await prisma.post.create({
      data: {
        content: supermanPosts[i],
        authorId: supermanAccount!.id,
      },
    });
  }

  // Seed Wonder Woman's posts
  for (let i = 0; i < wonderWomanPosts.length; i++) {
    await prisma.post.create({
      data: {
        content: wonderWomanPosts[i],
        authorId: wonderWomanAccount!.id,
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
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email().toLowerCase(),
        profileName: faker.person.fullName(),
        password: hashedPassword,
        profilePicture: faker.image.avatar(),
        isPremium: faker.datatype.boolean(),
        bio: fakeBios[i],
      },
    });
    users.push(user);
  }

  // Create fake posts
  for (let i = 0; i < 30; i++) {
    await prisma.post.create({
      data: {
        content: fakePosts[i],
        authorId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
      },
    });
  }

  // Create fake comments
  const posts = await prisma.post.findMany();
  for (let i = 0; i < 50; i++) {
    await prisma.comment.create({
      data: {
        // content: faker.lorem.sentences(2),
        content: fakeComments[i],
        authorId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        postId: posts[faker.number.int({ min: 0, max: posts.length - 1 })].id,
      },
    });
  }

  // Create fake replies to comments
  const comments = await prisma.comment.findMany();
  for (let i = 0; i < 30; i++) {
    const randInt = faker.number.int({ min: 0, max: comments.length - 1 });
    await prisma.comment.create({
      data: {
        // content: faker.lorem.sentences(2),
        content: fakeReplies[i],
        authorId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        parentCommentId: comments[randInt].id,
        postId: comments[randInt].postId,
      },
    });
  }

  // Create fake likes
  for (let i = 0; i < 120; i++) {
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
  for (let i = 0; i < 50; i++) {
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

  // Create fake bookmarks
  for (let i = 0; i < 50; i++) {
    const randomUser =
      users[faker.number.int({ min: 0, max: users.length - 1 })];
    const randomPost =
      posts[faker.number.int({ min: 0, max: posts.length - 1 })];

    await prisma.bookmark.create({
      data: {
        userId: randomUser.id,
        postId: randomPost.id,
      },
    });
  }

  console.log(
    "User accounts, posts, bookmarks, comments, and replies seeded successfully!"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
