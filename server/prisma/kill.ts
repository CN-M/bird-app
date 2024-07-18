import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`DROP SCHEMA public CASCADE`;
  await prisma.$executeRaw`CREATE SCHEMA public`;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
